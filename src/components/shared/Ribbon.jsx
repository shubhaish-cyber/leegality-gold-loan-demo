import C from "../../constants/colors";

export default function Ribbon({ text, bg = C.dark, color = "#FAC775" }) {
  return (
    <div style={{ background: bg, padding: "7px 16px", textAlign: "center", fontSize: 11, fontWeight: 600, color, letterSpacing: "0.05em" }}>
      {text}
    </div>
  );
}
