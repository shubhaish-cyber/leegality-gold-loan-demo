import C from "../../constants/colors";

export default function GoldBtn({ children, onClick, style = {}, disabled = false }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        width: "100%", background: disabled ? "#ccc" : C.goldMid,
        border: "none", borderRadius: 10, padding: "15px 20px",
        fontSize: 15, fontWeight: 700,
        color: disabled ? "#888" : C.goldDeep,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
