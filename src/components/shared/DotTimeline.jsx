import C from "../../constants/colors";
import { PHASES, PHASE_LABELS } from "../../constants/subScreens";

/**
 * 6-dot phase timeline.
 * Completed phase → filled gold dot with white ✓.
 * Current phase → filled gold dot with deeper ring.
 * Future phase → hollow dot with gray border.
 */
export default function DotTimeline({ currentPhase }) {
  const currentIdx = PHASES.indexOf(currentPhase);
  const visiblePhases = PHASES.slice(1); // skip "home" — timeline starts at Language

  return (
    <div
      style={{
        background: C.white,
        padding: "10px 16px 10px",
        borderBottom: "0.5px solid #e0ddd5",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        {visiblePhases.map((phase, i) => {
          const phaseIdx = i + 1; // +1 because we sliced off "home"
          const isDone = phaseIdx < currentIdx;
          const isCurrent = phaseIdx === currentIdx;

          return (
            <div
              key={phase}
              style={{
                display: "flex",
                alignItems: "center",
                flex: "0 0 auto",
                minWidth: 0,
                gap: 4,
              }}
            >
              <div
                style={{
                  width: isCurrent ? 18 : 14,
                  height: isCurrent ? 18 : 14,
                  borderRadius: "50%",
                  background: isDone || isCurrent ? C.goldMid : "transparent",
                  border: isCurrent
                    ? `2px solid ${C.goldDeep}`
                    : isDone
                    ? `1.5px solid ${C.goldMid}`
                    : `1.5px solid #D3D1C7`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.25s",
                  flexShrink: 0,
                }}
              >
                {isDone && (
                  <span style={{ fontSize: 8, color: C.white, fontWeight: 800, lineHeight: 1 }}>✓</span>
                )}
              </div>
              <span
                style={{
                  fontSize: 9,
                  color: isCurrent ? C.goldDeep : isDone ? C.goldMid : C.gray,
                  fontWeight: isCurrent ? 700 : 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 52,
                }}
              >
                {PHASE_LABELS[phase]}
              </span>
              {i < visiblePhases.length - 1 && (
                <div
                  style={{
                    width: 6,
                    height: 1,
                    background: isDone ? C.goldMid : "#D3D1C7",
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
