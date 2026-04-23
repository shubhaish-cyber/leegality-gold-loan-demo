import C from "../../constants/colors";
import { useLang } from "../../context/LangContext";

export default function AgentBanner() {
  const t = useLang();
  return (
    <div style={{ background: "#FFF8E7", borderBottom: `1.5px solid ${C.goldMid}`, padding: "8px 16px", fontSize: 12, fontWeight: 600, color: C.goldDark }}>
      {t.agentBanner}
    </div>
  );
}
