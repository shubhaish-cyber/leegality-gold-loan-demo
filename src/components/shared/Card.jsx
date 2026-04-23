import C from "../../constants/colors";

export default function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.white, border: "0.5px solid #e0ddd5", borderRadius: 12, padding: "14px 16px", ...style }}>
      {children}
    </div>
  );
}
