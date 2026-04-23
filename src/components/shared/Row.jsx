import C from "../../constants/colors";

export default function Row({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "0.5px solid #f0ede6" }}>
      <span style={{ fontSize: 13, color: C.gray }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: bold ? 700 : 500, color: bold ? C.goldDeep : "#333" }}>{value}</span>
    </div>
  );
}
