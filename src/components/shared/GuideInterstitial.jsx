import C from "../../constants/colors";
import FadeInUp from "../animations/FadeInUp";

/**
 * Full-screen dark-card interstitial shown BEFORE the content sub-screens of a phase.
 * Replaces the previous modal EntryCard — same visual language, now a first-class
 * sub-screen so it slides in with the rest of the flow.
 *
 * Props:
 *   variant     — "entry" | "handoff"
 *   action      — copy string (from src/constants/guide.js)
 *   onNext      — advance handler
 *   nextLabel   — CTA copy (default depends on variant)
 */
export default function GuideInterstitial({
  variant = "entry",
  action,
  onNext,
  nextLabel,
}) {
  const isHandoff = variant === "handoff";
  const defaultCta = isHandoff
    ? "Customer, tap here to continue"
    : "Got it — show the screen";

  return (
    <div
      style={{
        flex: 1,
        background: C.grayLight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
      }}
    >
      <FadeInUp>
        <div
          style={{
            background: C.dark,
            borderRadius: 20,
            padding: "32px 28px",
            maxWidth: 360,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
          }}
        >
          {isHandoff ? (
            <>
              <div style={{ fontSize: 48, marginBottom: 12, lineHeight: 1 }}>🤝</div>
              <div
                style={{
                  fontSize: 19,
                  fontWeight: 700,
                  color: C.white,
                  marginBottom: 10,
                  lineHeight: 1.3,
                }}
              >
                Hand the device to the customer
              </div>
            </>
          ) : (
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#FAC775",
                marginBottom: 14,
                textTransform: "uppercase",
              }}
            >
              Demo Guide
            </div>
          )}

          <div
            style={{
              fontSize: 14,
              color: isHandoff ? "#D9D9D6" : "#E8E6DF",
              lineHeight: 1.55,
              marginBottom: 22,
            }}
          >
            {action}
          </div>

          <button
            onClick={onNext}
            style={{
              width: "100%",
              background: C.purple,
              color: C.white,
              border: "none",
              borderRadius: 10,
              padding: "14px 18px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {nextLabel || defaultCta}
          </button>
        </div>
      </FadeInUp>
    </div>
  );
}
