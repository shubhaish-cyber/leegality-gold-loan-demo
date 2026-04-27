import C from "../../constants/colors";
import FadeInUp from "../animations/FadeInUp";

/**
 * Full-screen interstitial shown BEFORE the content sub-screens of a phase.
 *
 * Visual language:
 *   - whole screen flooded gold (no card)
 *   - large bold near-black headline (the `action` copy)
 *   - optional smaller subtext below
 *   - single purple "Continue" CTA pinned to the bottom
 *
 * Props:
 *   variant     — "entry" | "handoff"
 *   action      — bold headline copy
 *   sub         — optional smaller paragraph rendered under `action`
 *   onNext      — advance handler
 *   nextLabel   — CTA copy (default depends on variant)
 */
export default function GuideInterstitial({
  variant = "entry",
  action,
  sub,
  onNext,
  nextLabel,
}) {
  const isHandoff = variant === "handoff";
  const defaultCta = isHandoff ? "I'm ready to sign" : "Continue";

  return (
    <div
      style={{
        flex: 1,
        background: C.goldMid,
        display: "flex",
        flexDirection: "column",
        padding: "32px 28px 40px",
      }}
    >
      {/* Centered headline */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FadeInUp>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: C.goldDeep,
              lineHeight: 1.2,
              textAlign: "center",
              maxWidth: 380,
              margin: "0 auto",
            }}
          >
            {action}
          </div>
          {sub && (
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: C.goldDeep,
                opacity: 0.85,
                lineHeight: 1.5,
                textAlign: "center",
                maxWidth: 380,
                margin: "16px auto 0",
              }}
            >
              {sub}
            </div>
          )}
        </FadeInUp>
      </div>

      {/* Pinned CTA */}
      <FadeInUp delay={0.15}>
        <button
          onClick={onNext}
          style={{
            width: "100%",
            maxWidth: 380,
            margin: "0 auto",
            display: "block",
            background: C.purple,
            color: C.white,
            border: "none",
            borderRadius: 10,
            padding: "16px 20px",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(83, 74, 183, 0.28)",
          }}
        >
          {nextLabel || defaultCta}
        </button>
      </FadeInUp>
    </div>
  );
}
