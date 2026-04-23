import { useState } from "react";
import QuestionScreen from "../../components/shared/QuestionScreen";
import Card from "../../components/shared/Card";
import Row from "../../components/shared/Row";
import { useLang } from "../../context/LangContext";
import { useFormData } from "../../context/FormContext";
import { useLeegalityKFS, assertLeegalitySignUrl } from "../../hooks/useLeegality";

export default function Terms({ onNext }) {
  const t = useLang();
  const { name, email, mobile } = useFormData();
  const startKfsSign = useLeegalityKFS();
  const [error, setError] = useState(null);

  const handleKfsSign = () => {
    setError(null);

    const popup = window.open(
      "about:blank",
      "leegality-kfs-esign",
      "width=900,height=820,menubar=no,toolbar=no,location=no,status=no"
    );
    if (!popup) {
      setError("Popup was blocked. Please allow popups for this site and click again.");
      return;
    }
    try {
      popup.document.write(
        `<html><head><title>Leegality eSign — KFS</title></head>
         <body style="font-family:system-ui,sans-serif;padding:60px;text-align:center;color:#555;background:#f8f5ef;">
           <h3 style="margin:0 0 8px;">Preparing KFS signing session…</h3>
           <p style="margin:0;opacity:0.7;">Please don't close this window.</p>
         </body></html>`
      );
    } catch { /* ignore */ }

    // Fire-and-forget: kick off Leegality, navigate popup when ready.
    startKfsSign({ name, email, mobile })
      .then((res) => {
        const signUrl = assertLeegalitySignUrl(res.invitations?.[0]?.signUrl);
        try { popup.location.href = signUrl; } catch { /* ignore */ }
      })
      .catch((e) => {
        console.error("[Leegality KFS] create error:", e);
        try { popup.close(); } catch { /* ignore */ }
      });

    // Advance wizard immediately.
    onNext?.();
  };

  return (
    <QuestionScreen
      title="Key Fact Statement"
      subtitle="The three numbers that matter."
      onNext={handleKfsSign}
      nextLabel="View KFS & acknowledge"
      banner="customer"
      footerNote={error ? `⚠️ ${error}` : undefined}
    >
      <Card>
        <Row label={t.loanAmountLabel} value="₹1,50,000" bold />
        <Row label={t.emiLabel} value="₹13,250/month" bold />
        <Row label="APR" value="12.8% p.a." bold />
      </Card>
    </QuestionScreen>
  );
}
