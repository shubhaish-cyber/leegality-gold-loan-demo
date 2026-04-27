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
      "We'll quickly confirm your name, email and mobile number. These will appear on your loan documents.",
  },
  valuation: {
    type: "strip",
    action: "After Application + KYC, customers go for Valuation.",
    sub:
      "Here valuator will eSign Valuation Certificate via app and customer via WhatsApp.",
  },
  sanction: {
    type: "handoff",
    action:
      "Please review your Key Fact Statement — the three numbers that matter for your loan — and eSign to confirm you've read the terms.",
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
