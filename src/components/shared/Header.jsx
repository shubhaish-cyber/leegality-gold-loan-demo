import C from "../../constants/colors";

export default function Header({ right }) {
  return (
    <div style={{
      background: C.white, padding: "12px 16px",
      borderBottom: "0.5px solid #e0ddd5",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", background: C.goldMid,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: C.goldLight }} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.goldDeep, fontFamily: "Georgia, serif" }}>Swarna Bank</div>
          <div style={{ fontSize: 10, color: C.gray }}>Gold Loan — Branch Demo</div>
        </div>
      </div>
      {right}
    </div>
  );
}
