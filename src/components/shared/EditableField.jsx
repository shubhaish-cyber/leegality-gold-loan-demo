import C from "../../constants/colors";

export default function EditableField({ label, value, onChange, type = "text", last = false }) {
  return (
    <div style={{ marginBottom: last ? 0 : 14 }}>
      <div style={{ fontSize: 11, color: C.gray, marginBottom: 4 }}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", boxSizing: "border-box",
          background: C.white, border: `1.5px solid ${C.goldMid}`,
          borderRadius: 8, padding: "10px 12px",
          fontSize: 14, color: "#222", outline: "none",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}
