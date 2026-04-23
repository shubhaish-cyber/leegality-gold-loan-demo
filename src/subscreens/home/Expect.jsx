import { motion } from "framer-motion";
import C from "../../constants/colors";
import GoldBtn from "../../components/shared/GoldBtn";
import FadeInUp from "../../components/animations/FadeInUp";
import { useLang } from "../../context/LangContext";

const STAGGER = 0.15;
const DELAY_CHILDREN = 0.2;

// Slide-in-from-left cascade.
const slideContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER, delayChildren: DELAY_CHILDREN },
  },
};

const slideItem = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 240, damping: 22, mass: 0.9 },
  },
};

const ITEMS = [
  <>You will eSign three documents — <strong>KFS</strong>, <strong>Loan Agreement</strong>, and <strong>Valuation Certificate</strong>.</>,
  "You'll enter a name, email and mobile — this data powers the eSign workflow.",
  "After each eSign, you'll receive the signed document and audit trail on SMS, WhatsApp and email.",
  "Each document is signed via Aadhaar eSign powered by Leegality — legally valid under the IT Act, 2000.",
  "The entire journey takes under 5 minutes and mirrors a real gold loan branch experience.",
];

// Footer enters together with item 4 (index 3), not with the last item.
const FOOTER_DELAY = DELAY_CHILDREN + 3 * STAGGER;

export default function Expect({ onNext, onBack }) {
  const t = useLang();
  return (
    <div
      style={{
        flex: 1,
        background: C.white,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 24px 16px",
          minHeight: 0,
        }}
      >
        <FadeInUp>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.goldDark,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            In this demo
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#111",
              lineHeight: 1.25,
              marginBottom: 18,
            }}
          >
            What to expect
          </div>
        </FadeInUp>

        <motion.div
          variants={slideContainer}
          initial="hidden"
          animate="visible"
        >
          {ITEMS.map((item, i) => (
            <motion.div key={i} variants={slideItem}>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: C.goldLight,
                    border: `1.5px solid ${C.goldMid}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.goldDeep }}>
                    {i + 1}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#333", lineHeight: 1.5 }}>
                  {item}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: FOOTER_DELAY, ease: "easeOut" }}
        style={{
          padding: "12px 24px 20px",
          borderTop: "0.5px solid #eceae3",
          background: C.white,
        }}
      >
        <GoldBtn onClick={onNext} style={{ fontSize: 15, padding: "14px 20px", borderRadius: 12 }}>
          {t.homeCta} →
        </GoldBtn>
        <button
          onClick={onBack}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            padding: "8px",
            fontSize: 13,
            color: C.gray,
            cursor: "pointer",
            marginTop: 2,
          }}
        >
          ← Back
        </button>
      </motion.div>
    </div>
  );
}
