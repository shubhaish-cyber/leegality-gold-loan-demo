import C from "../../constants/colors";
import GoldBtn from "./GoldBtn";
import AgentBanner from "./AgentBanner";
import CustomerBanner from "./CustomerBanner";
import FadeInUp from "../animations/FadeInUp";

/**
 * Shared layout wrapper for every content sub-screen in the Typeform-style flow.
 * One focused question / review block per screen with a single Next CTA at the bottom.
 *
 * The content area (title + children) scrolls internally if it exceeds the available
 * space, while the Next CTA stays pinned to the bottom of the viewport so the user
 * can always advance — no matter how tall the content is.
 *
 * Props:
 *   title        — big headline (e.g. "What's the customer's name?")
 *   subtitle     — supporting hint below the title
 *   children     — the focused content (input, card, review blocks)
 *   onNext       — advance handler
 *   nextLabel    — CTA copy (default "Next →")
 *   canAdvance   — disables Next when false (used for required-field validation)
 *   banner       — "agent" | "customer" | null — renders the appropriate banner above content
 *   footerNote   — small gray text under the Next button
 *   hero         — optional leading emoji / icon rendered above the title
 */
export default function QuestionScreen({
  title,
  subtitle,
  children,
  onNext,
  nextLabel = "Next →",
  canAdvance = true,
  banner = null,
  footerNote,
  hero,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {banner === "agent" && <AgentBanner />}
      {banner === "customer" && <CustomerBanner />}

      {/* Scrollable content region */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "22px 20px 14px",
          background: C.grayLight,
          minHeight: 0,
        }}
      >
        <FadeInUp delay={0.05}>
          {hero && (
            <div style={{ fontSize: 34, marginBottom: 10, lineHeight: 1 }}>{hero}</div>
          )}
          {title && (
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: C.goldDeep,
                marginBottom: subtitle ? 6 : 18,
                lineHeight: 1.25,
              }}
            >
              {title}
            </div>
          )}
          {subtitle && (
            <div
              style={{
                fontSize: 13,
                color: C.gray,
                lineHeight: 1.5,
                marginBottom: 18,
              }}
            >
              {subtitle}
            </div>
          )}
        </FadeInUp>

        <FadeInUp delay={0.15}>
          <div>{children}</div>
        </FadeInUp>
      </div>

      {/* Sticky footer — always visible, regardless of content height */}
      <div
        style={{
          padding: "12px 20px 18px",
          background: C.grayLight,
          borderTop: "0.5px solid #e0ddd5",
        }}
      >
        <GoldBtn onClick={canAdvance ? onNext : undefined} disabled={!canAdvance}>
          {nextLabel}
        </GoldBtn>
        {footerNote && (
          <div
            style={{
              textAlign: "center",
              marginTop: 8,
              fontSize: 11,
              color: C.gray,
            }}
          >
            {footerNote}
          </div>
        )}
      </div>
    </div>
  );
}
