// Single source of truth for the Typeform-style sub-screen flow.
// Each entry describes one focused sub-screen. App.jsx walks this array by index.
//
// Keys are used by App.jsx to resolve the component; see src/subscreens/* for
// the one-to-one mapping. Banners are rendered inside content sub-screens via
// QuestionScreen. Chrome=false hides header/progress/nav for intro sub-screens.

export const PHASES = [
  "home",
  "language",
  "application",
  "valuation",
  "sanction",
  "agreement",
  "success",
];

export const PHASE_LABELS = {
  home: "Start",
  language: "Language",
  application: "Application",
  valuation: "Valuation",
  sanction: "Sign KFS",
  agreement: "Agreement",
  success: "Complete",
};

// banner: "agent" | "customer" | null
// chrome: whether to render ribbon/header/progress/dot-timeline/nav around the sub-screen
// guide: demo-guide interstitial — only bottom progress bar + nav are shown;
//        ribbon / header / dot-timeline are hidden so the instruction card has the full screen.
export const SUB_SCREENS = [
  { key: "home-welcome", phase: "home", banner: null, chrome: false },
  { key: "home-flow", phase: "home", banner: null, chrome: false },
  { key: "home-branch", phase: "home", banner: null, chrome: false },

  { key: "language", phase: "language", banner: null, chrome: true },

  { key: "application-guide", phase: "application", banner: null, chrome: true, guide: true },
  { key: "application-name", phase: "application", banner: "agent", chrome: true },
  { key: "application-email", phase: "application", banner: "agent", chrome: true },
  { key: "application-mobile", phase: "application", banner: "agent", chrome: true },

  { key: "valuation-guide", phase: "valuation", banner: null, chrome: true, guide: true },
  { key: "valuation-items", phase: "valuation", banner: "customer", chrome: true },

  { key: "sanction-handoff", phase: "sanction", banner: null, chrome: true, guide: true },
  { key: "sanction-terms", phase: "sanction", banner: "customer", chrome: true },

  { key: "agreement-guide", phase: "agreement", banner: null, chrome: true, guide: true },
  { key: "agreement-review", phase: "agreement", banner: "customer", chrome: true },

  { key: "success-celebrate", phase: "success", banner: null, chrome: true },
];

export function findSubScreen(key) {
  return SUB_SCREENS.find((s) => s.key === key);
}

export function phaseIndex(phase) {
  return PHASES.indexOf(phase);
}
