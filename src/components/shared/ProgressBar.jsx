import C from "../../constants/colors";

/**
 * Thin top progress bar showing (currentIdx + 1) / total across all sub-screens.
 * Inspired by Typeform's percentage fill.
 */
export default function ProgressBar({ currentIdx, total }) {
  const pct = Math.min(100, Math.max(0, ((currentIdx + 1) / total) * 100));
  return (
    <div style={{ background: "#eceae3", height: 3, width: "100%" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: C.goldMid,
          transition: "width 0.35s ease-out",
        }}
      />
    </div>
  );
}
