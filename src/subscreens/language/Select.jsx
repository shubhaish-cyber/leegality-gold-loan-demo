import { useContext } from "react";
import { motion } from "framer-motion";
import C from "../../constants/colors";
import LANGUAGES from "../../constants/languages";
import { LangCtx, useLang } from "../../context/LangContext";
import QuestionScreen from "../../components/shared/QuestionScreen";

export default function Select({ onNext }) {
  const { lang, setLang } = useContext(LangCtx);
  const t = useLang();
  const currentName = LANGUAGES.find((l) => l.code === lang)?.name || "English";

  return (
    <QuestionScreen
      title={t.chooseLanguage}
      subtitle={t.selectComfort}
      onNext={onNext}
      nextLabel={t.continueIn(currentName)}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}
      >
        {LANGUAGES.map((l) => {
          const selected = lang === l.code;
          return (
            <motion.div
              key={l.code}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
              }}
              onClick={() => setLang(l.code)}
              style={{
                background: selected ? C.goldLight : C.white,
                border: `${selected ? "2px" : "0.5px"} solid ${selected ? C.goldMid : "#e0ddd5"}`,
                borderRadius: 10,
                padding: "14px 8px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: selected ? C.goldDeep : "#333",
                  marginBottom: 4,
                }}
              >
                {l.label}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: selected ? C.goldDark : C.gray,
                }}
              >
                {l.name}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </QuestionScreen>
  );
}
