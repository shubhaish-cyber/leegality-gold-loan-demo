import { useState } from "react";
import C from "../../constants/colors";
import GOLD_ITEMS from "../../constants/goldItems";
import QuestionScreen from "../../components/shared/QuestionScreen";
import Card from "../../components/shared/Card";
import { StaggerContainer, StaggerItem } from "../../components/animations/FadeInUp";
import { useLang } from "../../context/LangContext";
import { useFormData } from "../../context/FormContext";
import { useLeegalityValuation, assertLeegalitySignUrl } from "../../hooks/useLeegality";

export default function Items({ onNext }) {
  const t = useLang();
  const { name, email, mobile } = useFormData();
  const startValuationSign = useLeegalityValuation();
  const [error, setError] = useState(null);

  const handleGenerate = () => {
    setError(null);

    // Open popup synchronously inside the click handler (user-gesture scope)
    // so browser popup blockers allow it.
    const popup = window.open(
      "about:blank",
      "leegality-esign",
      "width=900,height=820,menubar=no,toolbar=no,location=no,status=no"
    );
    if (!popup) {
      setError("Popup was blocked. Please allow popups for this site and click again.");
      return;
    }
    try {
      popup.document.write(
        `<html><head><title>Leegality eSign</title></head>
         <body style="font-family:system-ui,sans-serif;padding:60px;text-align:center;color:#555;background:#f8f5ef;">
           <h3 style="margin:0 0 8px;">Preparing your signing session…</h3>
           <p style="margin:0 0 16px;opacity:0.7;">Please don't close this window.</p>
           <p style="margin:0;max-width:520px;margin-left:auto;margin-right:auto;font-size:14px;line-height:1.55;color:#412402;background:#FAEEDA;border:1px solid #EF9F27;border-radius:10px;padding:12px 16px;">Valuator's Aadhaar eSign with GPS location ON &mdash; customer will get eSign link on WhatsApp</p>
         </body></html>`
      );
    } catch { /* ignore */ }

    // Fire the Leegality call in the background; once the signUrl comes back,
    // navigate the popup to it. The wizard advances immediately below —
    // we do NOT await, so the agent can keep moving while the customer signs.
    startValuationSign({ name, email, mobile })
      .then((res) => {
        const firstSignUrl = assertLeegalitySignUrl(res.invitations?.[0]?.signUrl);
        try { popup.location.href = firstSignUrl; } catch { /* ignore */ }
      })
      .catch((e) => {
        console.error("[Leegality Valuation] create error:", e);
        try { popup.close(); } catch { /* ignore */ }
      });

    // Advance the wizard immediately — do NOT wait for eSign to complete.
    onNext?.();
  };

  return (
    <QuestionScreen
      title={t.goldValuation}
      subtitle="Here's each item the agent weighed and tested."
      onNext={handleGenerate}
      nextLabel="Generate & eSign Valuation Certificate"
      banner="customer"
      footerNote={error ? `⚠️ ${error}` : undefined}
    >
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1.2fr",
            gap: 4,
            background: "#f8f5ef",
            padding: "8px 12px",
            borderBottom: "0.5px solid #e0ddd5",
          }}
        >
          {[t.item, t.weight, t.purity, t.valuation].map((h) => (
            <div
              key={h}
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.gray,
                textTransform: "uppercase",
              }}
            >
              {h}
            </div>
          ))}
        </div>
        <StaggerContainer stagger={0.15}>
          {GOLD_ITEMS.map((item, i) => (
            <StaggerItem key={i}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1.2fr",
                  gap: 4,
                  padding: "12px 12px",
                  borderBottom:
                    i < GOLD_ITEMS.length - 1 ? "0.5px solid #f0ede6" : "none",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        objectFit: "cover",
                        flexShrink: 0,
                        border: "0.5px solid #e0ddd5",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        background: "#f4f1ea",
                        border: "1px dashed #cfc9ba",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        color: "#b0ab9c",
                        flexShrink: 0,
                      }}
                      aria-label={`${item.name} image placeholder`}
                    >
                      🖼️
                    </div>
                  )}
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#333", lineHeight: 1.3 }}>
                    {item.name}
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>
                  {item.weight}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    background: C.goldLight,
                    color: C.goldDark,
                    padding: "2px 6px",
                    borderRadius: 4,
                    fontWeight: 700,
                    display: "inline-block",
                    width: "fit-content",
                  }}
                >
                  {item.purity}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.goldMid }}>
                  {item.value}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Card>
    </QuestionScreen>
  );
}
