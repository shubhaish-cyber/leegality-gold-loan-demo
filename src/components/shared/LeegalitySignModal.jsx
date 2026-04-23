import { useEffect, useRef, useState } from "react";
import { fetchLeegalityStatus } from "../../hooks/useLeegality";
import C from "../../constants/colors";

/**
 * In-app status card shown while Invitee 1 signs in a popup window.
 *
 * Leegality denies iframe embedding (X-Frame-Options), so the sign page runs
 * in a popup (opened synchronously from the button-click gesture in Items.jsx
 * to avoid popup blockers). This component:
 *   - displays status (Waiting / Signed / Rejected)
 *   - polls GET /v3.2/sign/request every 4s
 *   - fires onSigned when requests[0].signed becomes true
 *   - watches the popup — if the user closes it without signing, we can still
 *     keep polling (signer might complete later via their other device/channel)
 *
 * Props:
 *   documentId    — from POST /v3.0/sign/request
 *   signUrl       — Invitee 1's signUrl (for the "Re-open window" button)
 *   popupRef      — ref holding the window popup opened in the click handler
 *   onSigned      — callback when Invitee 1 finishes signing
 *   onClose       — user dismissed the card without completing
 */
export default function LeegalitySignModal({
  documentId,
  signUrl,
  popupRef,
  onSigned,
  onClose,
}) {
  const [status, setStatus] = useState("Opening signing window…");
  const [popupClosed, setPopupClosed] = useState(false);
  const firedRef = useRef(false);

  // Poll document status.
  useEffect(() => {
    if (!documentId) return;
    let cancelled = false;
    let timer;

    const tick = async () => {
      try {
        const data = await fetchLeegalityStatus(documentId);
        if (cancelled) return;

        const requests = data?.requests || [];
        const first = requests[0];
        const firstSigned = !!first?.signed;
        const firstRejected = !!first?.rejected;

        if (firstSigned) {
          if (!firedRef.current) {
            firedRef.current = true;
            setStatus("Signed. Advancing…");
            try { popupRef?.current?.close(); } catch { /* ignore */ }
            onSigned?.(data);
          }
          return;
        }
        if (firstRejected) {
          setStatus("Signer rejected the document.");
          return;
        }

        setStatus("Waiting for signer…");
      } catch (err) {
        if (!cancelled) setStatus(`Status check failed: ${err.message}`);
      }

      if (!cancelled) timer = setTimeout(tick, 4000);
    };

    timer = setTimeout(tick, 1500);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [documentId, onSigned, popupRef]);

  // Watch popup state.
  useEffect(() => {
    if (!popupRef) return;
    const interval = setInterval(() => {
      const win = popupRef.current;
      if (!win || win.closed) setPopupClosed(true);
      else setPopupClosed(false);
    }, 1000);
    return () => clearInterval(interval);
  }, [popupRef]);

  const handleReopen = () => {
    if (!signUrl) return;
    const win = window.open(signUrl, "leegality-esign", "width=900,height=820");
    if (win && popupRef) popupRef.current = win;
  };

  const handleCancel = () => {
    try { popupRef?.current?.close(); } catch { /* ignore */ }
    onClose?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 16px",
            background: C.goldDeep,
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            eSign — Valuation Certificate
          </div>
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
            Invitee 1 signing in a popup window
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 18px", textAlign: "center" }}>
          {/* Spinner / state icon */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: firedRef.current
                ? "#2d8b55"
                : popupClosed
                ? "#c25a3a"
                : C.goldLight,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              margin: "0 auto 14px",
            }}
          >
            {firedRef.current ? "✓" : popupClosed ? "!" : "⏳"}
          </div>

          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#333",
              marginBottom: 6,
            }}
          >
            {status}
          </div>

          {popupClosed && !firedRef.current && (
            <div style={{ fontSize: 12, color: C.gray, lineHeight: 1.5, marginBottom: 14 }}>
              The signing window was closed. You can re-open it to continue.
            </div>
          )}

          {!popupClosed && !firedRef.current && (
            <div style={{ fontSize: 12, color: C.gray, lineHeight: 1.5, marginBottom: 14 }}>
              Complete signing in the popup window. This page will advance automatically once done.
            </div>
          )}

          {/* Doc ID footer for debugging */}
          {documentId && (
            <div
              style={{
                fontSize: 10,
                color: "#aaa",
                marginBottom: 14,
                fontFamily: "monospace",
              }}
            >
              doc: {documentId}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {popupClosed && !firedRef.current && (
              <button
                onClick={handleReopen}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "none",
                  background: C.goldMid,
                  color: "#412402",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Re-open signing window
              </button>
            )}

            <button
              onClick={handleCancel}
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#fff",
                color: "#666",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
