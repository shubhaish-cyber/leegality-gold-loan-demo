const GUIDE = {
  language: {
    type: "strip",
    action: "Tap any language to show the live switch, then select your preferred language and tap Continue.",
  },
  application: {
    type: "entry",
    action: "Show the pre-filled customer details and loan terms, then tap Proceed to Gold Valuation.",
  },
  valuation: {
    type: "strip",
    action: "Walk through the 4 gold items and the Loan Summary at the bottom, then tap Proceed to Document Signing.",
  },
  sanction: {
    type: "handoff",
    action: "Hand the device to the customer. Ask them to review the KFS terms and tap Sign.",
  },
  agreement: {
    type: "strip",
    action: "Point out both signed status badges at the top, then tap Sign Loan Agreement.",
  },
  success: {
    type: "strip",
    action: "Show the signed documents checklist and loan account number. Tap Start New Application to reset.",
  },
};

export default GUIDE;
