import C from "../../constants/colors";

export default function NavBar({ onBack, onReset }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", background: C.white, borderTop: "0.5px solid #e8e4da" }}>
      <button
        onClick={onBack}
        style={{
          display: "flex", alignItems: "center", gap: 5, background: "none",
          border: "0.5px solid #e0ddd5", borderRadius: 8, padding: "6px 12px",
          fontSize: 12, fontWeight: 600, color: C.gray, cursor: "pointer",
        }}
      >
        ← Back
      </button>
      <button
        onClick={onReset}
        style={{
          display: "flex", alignItems: "center", gap: 5, background: "none",
          border: `0.5px solid ${C.red}`, borderRadius: 8, padding: "6px 12px",
          fontSize: 12, fontWeight: 600, color: C.red, cursor: "pointer",
        }}
      >
        ↺ Reset
      </button>
    </div>
  );
}
