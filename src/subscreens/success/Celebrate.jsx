import { motion } from "framer-motion";
import C from "../../constants/colors";
import FadeInUp from "../../components/animations/FadeInUp";
import { useLang } from "../../context/LangContext";

const CONTACT_URL = "https://www.leegality.com/#contact-form";

export default function Celebrate() {
  const t = useLang();
  return (
    <div
      style={{
        flex: 1,
        padding: "32px 20px",
        background: C.grayLight,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        style={{
          textAlign: "center",
          padding: "38px 22px",
          background: `linear-gradient(135deg, ${C.goldLight}, #fff)`,
          borderRadius: 18,
          border: `1px solid ${C.goldMid}`,
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: C.goldDeep,
            marginBottom: 10,
            lineHeight: 1.25,
          }}
        >
          {t.successTitle}
        </div>
        <div style={{ fontSize: 14, color: C.goldDark, lineHeight: 1.55 }}>
          {t.successSub}
        </div>
      </motion.div>

      <FadeInUp delay={0.6}>
        <a
          href={CONTACT_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            background: C.purple,
            color: C.white,
            textAlign: "center",
            border: "none",
            borderRadius: 10,
            padding: "15px 20px",
            fontSize: 15,
            fontWeight: 700,
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Contact Sales →
        </a>
      </FadeInUp>
    </div>
  );
}
