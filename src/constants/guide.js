// Copy shown on demo-guide interstitial cards between phases.
// Written in the app's voice — speaking directly to the customer.
const GUIDE = {
  language: {
    type: "strip",
    action:
      "Pick the language you're most comfortable with. You can change it anytime.",
  },
  application: {
    type: "entry",
    action:
      "Loan application interface, communication, loan kit and eSign interface — all should be in the language selected by the borrower — for RBI compliance.",
  },
  valuation: {
    type: "strip",
    action: "After Application + KYC, customers go for Valuation.",
    sub:
      "Here valuator will eSign Valuation Certificate and Customer will do a Virtual Sign to prove their presence during Valuation — for RBI compliance.",
  },
  sanction: {
    type: "handoff",
    action:
      "Collect borrower acknowledgement on the KFS, once loan terms are finalized.",
  },
  agreement: {
    type: "strip",
    action:
      "One last signature. We'll open your Loan Agreement so you can eSign and complete your gold loan.",
  },
  success: {
    type: "strip",
    action:
      "Your loan is approved. You'll receive the signed documents on email, SMS and WhatsApp shortly.",
  },
};

export default GUIDE;
