import C from "../../constants/colors";
import { useLang } from "../../context/LangContext";

export default function CustomerBanner() {
  const t = useLang();
  return (
    <div style={{ background: C.greenLight, borderBottom: `1.5px solid ${C.green}`, padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "#085041" }}>
      {t.customerBanner}
    </div>
  );
}
