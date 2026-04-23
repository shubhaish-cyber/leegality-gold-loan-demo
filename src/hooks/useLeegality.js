import { useCallback } from "react";
import { useLangCode } from "../context/LangContext";

// Only log verbose details in dev. In prod builds this is tree-shaken out.
const DEV = import.meta.env.DEV;
import { getValuationWorkflow } from "../constants/leegalityWorkflows";
import { getKfsWorkflow } from "../constants/leegalityKfsWorkflows";
import { getLaWorkflow } from "../constants/leegalityLaWorkflows";
import { populateTemplateFields } from "../constants/leegalityFieldValues";

/**
 * Normalizes "+91 98765 43210" → "9876543210" for this Leegality workflow's
 * phone validator (Indian mobile, 10 digits, no country code).
 * Strips all non-digits and a leading "91" if present.
 */
function normalizePhone(raw) {
  if (!raw) return "";
  let digits = String(raw).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

/**
 * Defensively verifies that a signUrl returned by the API is an https URL on
 * a trusted Leegality domain before we navigate a popup to it. Prevents a
 * compromised / malformed upstream response from turning a click into an
 * open-redirect or javascript:/data:-URL navigation.
 *
 * Returns the URL string if safe, otherwise throws.
 */
export function assertLeegalitySignUrl(url) {
  if (!url || typeof url !== "string") throw new Error("signUrl missing");
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("signUrl is not a valid URL");
  }
  if (parsed.protocol !== "https:") {
    throw new Error(`signUrl must use https (got ${parsed.protocol})`);
  }
  const ALLOWED_HOSTS = new Set([
    "sandbox.leegality.com",
    "app1.leegality.com",
    "dashboard.leegality.com",
  ]);
  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    throw new Error(`signUrl host "${parsed.hostname}" is not allow-listed`);
  }
  return url;
}

/** Short IRN for this demo: GL-VAL-<timestamp>-<short-random> */
function makeIrn() {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GL-VAL-${ts}-${rnd}`;
}

/**
 * LEEGALITY INTEGRATION POINT 1: Valuation Certificate
 *
 * Real implementation. Calls our Vite-proxy endpoint (/api/leegality/*), which
 * forwards to https://sandbox.leegality.com/api/* and injects X-Auth-Token
 * server-side. The token never leaves the Vite dev server — the client bundle
 * does not contain it.
 *
 * Per-language workflow: the profileId and template field IDs are looked up
 * from `VALUATION_WORKFLOWS_BY_LANG` using the lang code selected at the start
 * of the flow. Each language has its own Leegality template.
 */
export function useLeegalityValuation() {
  const { lang } = useLangCode();

  return useCallback(async (customerData) => {
    const workflow = getValuationWorkflow(lang);
    const { profileId, fields: templateFields } = workflow;

    const invitee = {
      name: customerData?.name || "",
      email: customerData?.email || "",
      phone: normalizePhone(customerData?.mobile),
    };

    // Per user requirement: same details for both invitees (demo).
    // The workflow itself controls signing order and notification channels
    // for Invitee 2 (email / SMS / WhatsApp), so we don't need to configure
    // those client-side.
    const payload = {
      profileId,
      file: { fields: templateFields },
      invitees: [invitee, invitee],
      irn: makeIrn(),
    };

    if (DEV) {
      console.log(`[Leegality] Valuation POST (lang=${lang}, profileId=${profileId})`);
    }

    let res;
    try {
      res = await fetch("/api/leegality/v3.0/sign/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (networkErr) {
      throw new Error(`Network error contacting Leegality proxy: ${networkErr.message}`);
    }

    // Leegality always returns HTTP 200; real status is in the body.
    const json = await res.json().catch(() => ({}));
    if (DEV) {
      console.log(`[Leegality] Valuation response (status=${json?.status}, docId=${json?.data?.documentId || "-"})`);
    }

    if (json.status !== 1 || !json.data) {
      const msg =
        json?.messages?.[0]?.message ||
        json?.messages?.[0]?.code ||
        "Unknown Leegality error";
      throw new Error(msg);
    }

    // API returns `invitees` (skill docs say `invitations` — discrepancy).
    // Accept either, prefer whichever is populated.
    const { documentId, expiryDate } = json.data;
    const invitations = json.data.invitations?.length
      ? json.data.invitations
      : json.data.invitees || [];

    return {
      documentId,
      invitations, // [{ name, signUrl, ... }, ...]
      expiryDate,
      irn: payload.irn,
    };
  }, [lang]);
}

/**
 * Poll lightweight status for a document.
 * Use this to detect when Invitee 1 has finished signing in the embedded iframe.
 *
 * Returns the parsed `data` object from Leegality's response, which includes
 * `signers[]` with their individual statuses once the document has progressed.
 */
export async function fetchLeegalityStatus(documentId) {
  if (!documentId) throw new Error("documentId required");
  const url = `/api/leegality/v3.2/sign/request?documentId=${encodeURIComponent(documentId)}`;
  const res = await fetch(url);
  const json = await res.json().catch(() => ({}));
  if (json.status !== 1) {
    const msg = json?.messages?.[0]?.message || "Failed to fetch status";
    throw new Error(msg);
  }
  return json.data;
}

/** Short IRN for KFS: GL-KFS-<timestamp>-<short-random> */
function makeKfsIrn() {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GL-KFS-${ts}-${rnd}`;
}

/**
 * LEEGALITY INTEGRATION POINT 2: KFS (Key Fact Statement)
 *
 * Real implementation. Same proxy / token-security pattern as the valuation
 * hook. Per-language workflow selection: the profileId + template field IDs
 * come from `KFS_WORKFLOWS_BY_LANG` keyed by the lang code selected at the
 * start of the flow.
 *
 * Difference from valuation:
 *   - KFS template has 1 invitee (customer only), not 2
 *   - Template has ~64-66 text fields (all optional, sent with empty values)
 */
export function useLeegalityKFS() {
  const { lang } = useLangCode();

  return useCallback(async (customerData) => {
    const workflow = getKfsWorkflow(lang);
    const { profileId, fields: templateFields } = workflow;

    const invitee = {
      name: customerData?.name || "",
      email: customerData?.email || "",
      phone: normalizePhone(customerData?.mobile),
    };

    const populatedFields = populateTemplateFields(templateFields, customerData);
    const filledCount = populatedFields.filter((f) => f.value && f.value !== "").length;

    const payload = {
      profileId,
      file: { fields: populatedFields },
      invitees: [invitee], // KFS = single-signer
      irn: makeKfsIrn(),
    };

    if (DEV) {
      console.log(`[Leegality] KFS POST (lang=${lang}, profileId=${profileId}, filled ${filledCount}/${populatedFields.length} fields)`);
    }

    let res;
    try {
      res = await fetch("/api/leegality/v3.0/sign/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (networkErr) {
      throw new Error(`Network error contacting Leegality proxy: ${networkErr.message}`);
    }

    const json = await res.json().catch(() => ({}));
    if (DEV) {
      console.log(`[Leegality] KFS response (status=${json?.status}, docId=${json?.data?.documentId || "-"})`);
    }

    if (json.status !== 1 || !json.data) {
      const msg =
        json?.messages?.[0]?.message ||
        json?.messages?.[0]?.code ||
        "Unknown Leegality error";
      throw new Error(msg);
    }

    const { documentId, expiryDate } = json.data;
    const invitations = json.data.invitations?.length
      ? json.data.invitations
      : json.data.invitees || [];

    return {
      documentId,
      invitations,
      expiryDate,
      irn: payload.irn,
    };
  }, [lang]);
}

/** Short IRN for LA: GL-LA-<timestamp>-<short-random> */
function makeLaIrn() {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GL-LA-${ts}-${rnd}`;
}

/**
 * LEEGALITY INTEGRATION POINT 3: Loan Agreement
 *
 * Real implementation. Same proxy / token-security pattern as the valuation
 * and KFS hooks. Per-language workflow selection via
 * `LA_WORKFLOWS_BY_LANG` keyed by the lang code selected at the start.
 *
 * LA workflow shape:
 *   - 2 invitees (customer + officer; signing order defined in workflow)
 *   - Large template (~660 fields for most languages, 66 for Malayalam)
 *     with text / radio / select types; all values sent empty for this demo.
 */
export function useLeegalityAgreement() {
  const { lang } = useLangCode();

  return useCallback(async (customerData) => {
    const workflow = getLaWorkflow(lang);
    const { profileId, fields: templateFields } = workflow;

    const invitee = {
      name: customerData?.name || "",
      email: customerData?.email || "",
      phone: normalizePhone(customerData?.mobile),
    };

    const populatedFields = populateTemplateFields(templateFields, customerData);
    const filledCount = populatedFields.filter((f) => f.value && f.value !== "").length;

    // Per user requirement: same details for both invitees (demo).
    // Workflow controls signing order and notification channels for Invitee 2.
    const payload = {
      profileId,
      file: { fields: populatedFields },
      invitees: [invitee, invitee],
      irn: makeLaIrn(),
    };

    if (DEV) {
      console.log(`[Leegality] LA POST (lang=${lang}, profileId=${profileId}, filled ${filledCount}/${populatedFields.length} fields)`);
    }

    let res;
    try {
      res = await fetch("/api/leegality/v3.0/sign/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (networkErr) {
      throw new Error(`Network error contacting Leegality proxy: ${networkErr.message}`);
    }

    const json = await res.json().catch(() => ({}));
    if (DEV) {
      console.log(`[Leegality] LA response (status=${json?.status}, docId=${json?.data?.documentId || "-"})`);
    }

    if (json.status !== 1 || !json.data) {
      const msg =
        json?.messages?.[0]?.message ||
        json?.messages?.[0]?.code ||
        "Unknown Leegality error";
      throw new Error(msg);
    }

    const { documentId, expiryDate } = json.data;
    const invitations = json.data.invitations?.length
      ? json.data.invitations
      : json.data.invitees || [];

    return {
      documentId,
      invitations,
      expiryDate,
      irn: payload.irn,
    };
  }, [lang]);
}
