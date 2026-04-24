import C from "../../constants/colors";
import GoldBtn from "../../components/shared/GoldBtn";
import FadeInUp from "../../components/animations/FadeInUp";
import { useLang } from "../../context/LangContext";

export default function Welcome({ onNext }) {
  const t = useLang();
  return (
    <div
      style={{
        flex: 1,
        background: C.white,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <FadeInUp delay={0.05}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: C.goldMid,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: C.white,
                fontFamily: "Georgia, serif",
              }}
            >
              S
            </span>
          </div>
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: C.goldDeep,
                fontFamily: "Georgia, serif",
              }}
            >
              Swarna Bank
            </div>
            <div style={{ fontSize: 13, color: C.gray, marginTop: 2 }}>
              Gold Loan — Branch Demo
            </div>
          </div>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.15}>
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#111",
            lineHeight: 1.25,
            marginBottom: 14,
          }}
        >
          {t.homeWhat}
        </div>
      </FadeInUp>

      <FadeInUp delay={0.25}>
        <div
          style={{
            fontSize: 15,
            color: "#444",
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          A mock gold loan branch experience that shows how{" "}
          <span style={{ color: C.goldMid, fontWeight: 700 }}>Leegality e-signing</span>{" "}
          fits into a real loan journey — from application to signed documents.
        </div>
      </FadeInUp>

      <FadeInUp delay={0.35}>
        <GoldBtn
          onClick={onNext}
          style={{ fontSize: 16, padding: "17px 20px", borderRadius: 12 }}
        >
          Let's walk through it →
        </GoldBtn>
      </FadeInUp>
    </div>
  );
}
