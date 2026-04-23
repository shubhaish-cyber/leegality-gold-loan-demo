import { motion } from "framer-motion";
import C from "../../constants/colors";
import GoldBtn from "../../components/shared/GoldBtn";
import FadeInUp from "../../components/animations/FadeInUp";
import { useLang } from "../../context/LangContext";

const STAGGER = 0.14;
const DELAY_CHILDREN = 0.2;

// Drop-from-top cascade: each step falls into place one after another.
const dropContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER, delayChildren: DELAY_CHILDREN },
  },
};

const dropItem = {
  hidden: { opacity: 0, y: -28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 18, mass: 0.9 },
  },
};

const STEPS = [
  { num: 1, label: "Select language" },
  { num: 2, label: "Loan application" },
  { num: 3, label: "Gold valuation", sub: "via Leegality" },
  { num: 4, label: "Sign KFS", sub: "via Leegality" },
  { num: 5, label: "Sign Loan Agreement", sub: "via Leegality" },
  { num: 6, label: "Loan disbursal" },
];

// Footer enters at the same moment the last step begins its drop.
const FOOTER_DELAY = DELAY_CHILDREN + (STEPS.length - 1) * STAGGER;

export default function Flow({ onNext, onBack }) {
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
            How it works
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#111",
              lineHeight: 1.25,
              marginBottom: 22,
            }}
          >
            {t.homeFlowTitle}
          </div>
        </FadeInUp>

        <motion.div
          variants={dropContainer}
          initial="hidden"
          animate="visible"
        >
          {STEPS.map((step, i) => (
            <motion.div key={i} variants={dropItem}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: C.goldMid,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.goldDeep }}>
                    {step.num}
                  </span>
                </div>
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#222" }}>
                    {step.label}
                  </div>
                  {step.sub && (
                    <div style={{ fontSize: 11, color: C.goldDark, marginTop: 1 }}>
                      {step.sub}
                    </div>
                  )}
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
        <GoldBtn onClick={onNext} style={{ fontSize: 15, padding: "14px 20px" }}>
          Next →
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
