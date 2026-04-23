import C from "../../constants/colors";

export default function Label({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: C.gray, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
      {children}
    </div>
  );
}
