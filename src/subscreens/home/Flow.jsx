import { useEffect, useState } from "react";
import C from "../../constants/colors";
import GoldBtn from "../../components/shared/GoldBtn";
import { useLang } from "../../context/LangContext";

const STEPS = [
  { num: 1, label: "Select language" },
  { num: 2, label: "Loan application" },
  { num: 3, label: "Gold valuation", sub: "via Leegality" },
  { num: 4, label: "Sign KFS", sub: "via Leegality" },
  { num: 5, label: "Sign Loan Agreement", sub: "via Leegality" },
  { num: 6, label: "Loan disbursal" },
];

// Cycle a highlighted color through the numbered circles one at a time.
// All text + CTA stay visible on mount; only the highlight moves.
const HIGHLIGHT_INTERVAL_MS = 700;

export default function Flow({ onNext, onBack }) {
  const t = useLang();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % STEPS.length);
    }, HIGHLIGHT_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        flex: 1,
        background: C.white,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 24px 16px",
          minHeight: 0,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: C.goldDark,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          How it works
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#111",
            lineHeight: 1.25,
            marginBottom: 22,
          }}
        >
          {t.homeFlowTitle}
        </div>

        {STEPS.map((step, i) => {
          const isActive = i === activeIdx;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: isActive ? C.goldDeep : C.goldMid,
                  boxShadow: isActive
                    ? "0 0 0 4px rgba(218, 165, 32, 0.25)"
                    : "none",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                  transition:
                    "background 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: isActive ? C.white : C.goldDeep,
                    transition: "color 0.35s ease",
                  }}
                >
                  {step.num}
                </span>
              </div>
              <div style={{ paddingTop: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#222" }}>
                  {step.label}
                </div>
                {step.sub && (
                  <div style={{ fontSize: 11, color: C.goldDark, marginTop: 1 }}>
                    {step.sub}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          padding: "12px 24px 20px",
          borderTop: "0.5px solid #eceae3",
          background: C.white,
        }}
      >
        <GoldBtn onClick={onNext} style={{ fontSize: 15, padding: "14px 20px" }}>
          Get Started →
        </GoldBtn>
        <button
          onClick={onBack}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            padding: "8px",
            fontSize: 13,
            color: C.gray,
            cursor: "pointer",
            marginTop: 2,
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
