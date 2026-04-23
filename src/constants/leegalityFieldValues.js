/**
 * Resolves a Leegality template field value based on its (English) display name.
 *
 * Why: Each KFS / Loan Agreement workflow has dozens to hundreds of template
 * fields. We pattern-match on the field's English name (user noted all
 * templates accept English values, regardless of the display language) and
 * return a sensible dummy based on the demo's loan context:
 *
 *   - Customer: Ramesh Kumar Sharma (from form)
 *   - Loan amount: ₹1,50,000
 *   - Tenure: 12 months
 *   - EMI / EPI: ₹13,250
 *   - APR: 12.8%
 *   - Gold: 80g, 22–24K (3 items — necklace, bangle pair, coin)
 *
 * Fields that don't match any pattern are left empty.
 */

// Hardcoded loan facts — everything the Sanction / Review screens display.
export const DEMO_LOAN = {
  loanAmount: "1,50,000",
  loanAmountWithRupee: "₹1,50,000",
  tenureMonths: "12",
  tenureLabel: "12 months",
  epi: "13,250",
  epiWithRupee: "₹13,250",
  interestRatePct: "12.80",
  aprPct: "12.80",
  numEpis: "12",
  goldWeightGrams: "80",
  goldPurity: "22–24K",
  loanType: "Gold Loan",
  city: "Bengaluru",
  state: "Karnataka",
  branchCode: "SWB-BLR-042",
  applicationId: "GL-APP-2026-0100423",
  customerId: "CUST-2026-00423",
  loanProposalNo: "LP-2026-00423",
  repaymentStart: "23-05-2026",
  agreementDate: "23-04-2026",
  applicationDate: "23-04-2026",
  sourceType: "Branch Walk-in",
  agentName: "Priya Reddy",
  agentCode: "AGT-0042",
  instalmentType: "Monthly EMI",
  repaymentAccount: "SWB4200100423",
  stampDutyPct: "0.1",
  processingFeesPct: "1.0",
  processingFeesAmt: "1,500",
  insuranceChargesAmt: "250",
  valuationFeesAmt: "500",
  penalChargesPct: "2.0",
  foreclosureChargesPct: "0",
  netDisbursedAmount: "1,47,500",
  totalInterestAmount: "9,000",
  totalPayable: "1,59,000",
  nodalOfficerPhone: "+91 80 1234 5678",
  nodalOfficerEmail: "grievances@swarnabank.example",
  coolingOffDays: "7",
  recoveryAgentClause: "Clause 14.2",
  grievanceClause: "Clause 17.1",
};

/** Returns `true` if `pat` (case-insensitive) appears anywhere in `name`. */
function includesCI(name, pat) {
  return name.toLowerCase().includes(pat.toLowerCase());
}

/** Matches *any* of the patterns. */
function any(name, patterns) {
  return patterns.some((p) => includesCI(name, p));
}

/**
 * Core resolver. Returns a dummy string for known field patterns.
 * customerData: { name, email, mobile } from the form.
 * Returns "" if nothing matched.
 */
export function resolveFieldValue(fieldName, customerData) {
  if (!fieldName) return "";
  const raw = String(fieldName);
  const n = raw.toLowerCase();

  // --- Customer identity ---
  // Email (check before Name so "Email address" doesn't match Name first)
  if (any(n, ["email", "e-mail", "mail id", "email id"])) return customerData?.email || "";
  // Phone / Mobile
  if (any(n, ["phone", "mobile", "contact no", "contact number", "whatsapp"])) return customerData?.mobile || "";
  // Customer / Borrower name
  if (
    any(n, [
      "customer name",
      "borrower name",
      "applicant name",
      "applicant's name",
      "signatory name",
      "full name",
      "name of the borrower",
      "name of borrower",
      "name of the customer",
      "name of applicant",
    ]) ||
    (includesCI(raw, "name") &&
      !any(n, [
        "file name",
        "branch name",
        "company name",
        "bank name",
        "agent name",
        "officer name",
        "city name",
        "location name",
        "benchmark",
        "re name",
        "programme name",
        "scheme name",
        "product name",
        "father",
        "husband",
        "mother",
        "spouse",
        "guardian",
        "nominee",
        "party name",
        "re (a) name",
        "re (b) name",
      ]))
  ) {
    return customerData?.name || "";
  }

  // --- Customer identifiers ---
  if (any(n, ["customer id", "customer number", "cust id"])) return DEMO_LOAN.customerId;
  if (any(n, ["application id", "application no", "app id", "app no"])) return DEMO_LOAN.applicationId;
  if (any(n, ["loan proposal", "proposal no", "proposal number", "loan account", "account no", "account number", "loan no", "loan number"])) {
    return DEMO_LOAN.loanProposalNo;
  }
  if (any(n, ["repayment account"])) return DEMO_LOAN.repaymentAccount;

  // --- Loan facts ---
  if (any(n, ["sanctioned loan amount", "loan amount", "sanctioned amount", "principal"])) return DEMO_LOAN.loanAmount;
  if (any(n, ["net disbursed", "net disbursement", "disbursed amount"])) return DEMO_LOAN.netDisbursedAmount;
  if (any(n, ["total interest amount", "total interest"])) return DEMO_LOAN.totalInterestAmount;
  if (any(n, ["total amount", "total amt", "amount to be paid", "total payable"])) return DEMO_LOAN.totalPayable;
  if (any(n, ["loan type", "type of loan", "product"])) return DEMO_LOAN.loanType;
  if (any(n, ["loan term", "loan tenure", "loan tenor", "tenure"])) return DEMO_LOAN.tenureLabel;

  // --- Interest / APR ---
  if (any(n, ["annual percentage rate", "apr"])) return DEMO_LOAN.aprPct;
  if (any(n, ["interest rate", "rate of interest", "roi", "final rate", "interest (%)"])) {
    return DEMO_LOAN.interestRatePct;
  }
  if (any(n, ["benchmark rate"])) return DEMO_LOAN.interestRatePct;
  if (any(n, ["spread"])) return "0";
  if (any(n, ["reset period"])) return "12";

  // --- EPI / EMI ---
  if (any(n, ["number of epi", "no. of epi", "nos. of epi", "no of epi", "number of emi", "no. of emi", "no. of installments", "no. of instalments"])) {
    return DEMO_LOAN.numEpis;
  }
  if (any(n, ["amount of each epi", "amount of epi", "epi amount", "emi amount"])) return DEMO_LOAN.epi;
  if (any(n, ["installment type", "instalment type", "type of epi", "type of emi"])) return DEMO_LOAN.instalmentType;
  if (n === "epi" || n === "emi") return DEMO_LOAN.epi;
  if (any(n, ["commencement of repayment", "repayment start", "repayment commencement", "initiation of repayment", "due date for payment", "due date of payment"])) {
    return DEMO_LOAN.repaymentStart;
  }

  // --- Fees & charges ---
  if (any(n, ["processing fees amount", "processing fees amt"]) || (any(n, ["processing fees"]) && any(n, ["amount"]))) {
    return DEMO_LOAN.processingFeesAmt;
  }
  if (any(n, ["processing fees"])) return DEMO_LOAN.processingFeesPct;
  if (any(n, ["insurance charges"]) && any(n, ["amount"])) return DEMO_LOAN.insuranceChargesAmt;
  if (any(n, ["insurance charges"])) return DEMO_LOAN.insuranceChargesAmt;
  if (any(n, ["valuation fees"])) return DEMO_LOAN.valuationFeesAmt;
  if (any(n, ["stamp duty"])) return DEMO_LOAN.stampDutyPct;
  if (any(n, ["penal charges", "penalty"])) return DEMO_LOAN.penalChargesPct;
  if (any(n, ["foreclosure"])) return DEMO_LOAN.foreclosureChargesPct;
  if (any(n, ["other charges", "any other charges"])) return "0";
  if (any(n, ["fee / charges payable", "fees payable", "charges payable"])) return "1,750";

  // --- Dates ---
  if (any(n, ["application date"])) return DEMO_LOAN.applicationDate;
  if (any(n, ["agreement date", "loan agreement dated", "sanction date"])) return DEMO_LOAN.agreementDate;
  if (any(n, ["expiry date"])) return "23-04-2027";

  // --- Location / branch ---
  if (any(n, ["city", "location name"])) return DEMO_LOAN.city;
  // Use word-boundary regex so "state the clause" (verb) doesn't match.
  if (/\bstate\b/i.test(raw) && any(n, ["residence", "home", "address", "customer", "applicant", "borrower"])) return DEMO_LOAN.state;
  if (/\bstate\b/i.test(raw) && !any(n, ["state the", "state that", "state of affairs"])) return DEMO_LOAN.state;
  if (any(n, ["branch code", "branch id"])) return DEMO_LOAN.branchCode;
  if (any(n, ["branch name", "branch"])) return "Swarna Bank — Bengaluru MG Road";
  if (any(n, ["pincode", "pin code", "postal code", "zip"])) return "560001";
  if (any(n, ["address"])) return "42 MG Road, Bengaluru, Karnataka 560001";

  // --- Agent / source ---
  if (any(n, ["source type"])) return DEMO_LOAN.sourceType;
  if (any(n, ["agent name", "sourcing agent name"])) return DEMO_LOAN.agentName;
  if (any(n, ["agent code", "sourcing agent code"])) return DEMO_LOAN.agentCode;

  // --- Disbursement / stage-wise ---
  // If the field is asking for a clause reference about stage-wise disbursement,
  // our demo is 100% advance so nothing applies. Handle before the broader
  // "stage wise" match below.
  if (any(n, ["stage wise"]) && any(n, ["clause"])) return "Not applicable (100% advance)";
  if (any(n, ["disbursement in stages", "100% advance", "stage wise", "stages or 100", "100% down payment"])) {
    return "100% advance";
  }

  // --- Gold-specific ---
  if (any(n, ["gold weight", "weight of gold", "total weight"])) return DEMO_LOAN.goldWeightGrams;
  if (any(n, ["purity"])) return DEMO_LOAN.goldPurity;

  // --- RE / lender boilerplate ---
  if (any(n, ["name of re", "name of the re", "re name"])) return "Swarna Bank Ltd";
  if (any(n, ["third-party", "third party"])) return "Nil";
  if (any(n, ["funding ratio"])) return "100%";

  // --- Qualitative / clause references ---
  if (any(n, ["cooling off", "look-up period", "lookup period"])) return `${DEMO_LOAN.coolingOffDays} days`;
  if (any(n, ["recovery agent"])) return DEMO_LOAN.recoveryAgentClause;
  if (any(n, ["grievance"])) return DEMO_LOAN.grievanceClause;
  if (any(n, ["nodal"]) && any(n, ["email"])) return DEMO_LOAN.nodalOfficerEmail;
  if (any(n, ["nodal"]) && any(n, ["phone", "number"])) return DEMO_LOAN.nodalOfficerPhone;
  if (any(n, ["nodal"])) return "Mr. Naveen Rao, Swarna Bank";

  // --- Reference benchmark ---
  if (any(n, ["reference benchmark"])) return "Not applicable";

  // --- Impact of benchmark change ---
  if (any(n, ["impact of change"]) && any(n, ["epi"])) return "0";
  if (any(n, ["impact of change"])) return "0";

  // --- Instalment schedule (numbered) — e.g., "Instalment No. 1", "Interest (in Rupees) 5" ---
  if (/instalment no\.?\s*\d+/i.test(raw) || /installment no\.?\s*\d+/i.test(raw)) return DEMO_LOAN.epi;
  if (/interest \(in rupees\)\s*\d+/i.test(raw)) return "1,500";
  if (/principal \(in rupees\)\s*\d+/i.test(raw)) return "11,750";
  if (/outstanding/i.test(raw) && /balance/i.test(raw)) return "1,50,000";

  // --- Declaration / acknowledgement boilerplate ---
  if (any(n, ["borrower relation with", "relationship with person"])) return "SELF";
  if (any(n, ["declaration"])) return "I / We confirm the above details";

  // --- Schedule / disbursement ---
  if (any(n, ["schedule of disbursement"])) return "Single tranche on agreement date";

  // Unmatched — leave blank.
  return "";
}

/**
 * Apply the resolver to an array of template field objects and return a new
 * array with `value` populated (for text/select fields). Radio fields keep
 * their original `value` / `checked` shape — the template itself defines the
 * options, we don't flip them here.
 */
export function populateTemplateFields(fields, customerData) {
  return fields.map((f) => {
    if (f.type === "radio") return f; // leave radios as-configured in the template
    const resolved = resolveFieldValue(f.name, customerData);
    if (!resolved) return f;
    return { ...f, value: resolved };
  });
}
