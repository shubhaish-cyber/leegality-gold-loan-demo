import { useState } from "react";
import QuestionScreen from "../../components/shared/QuestionScreen";
import Card from "../../components/shared/Card";
import Row from "../../components/shared/Row";
import { useLang } from "../../context/LangContext";
import { useFormData } from "../../context/FormContext";
import { useLeegalityAgreement } from "../../hooks/useLeegality";

export default function Review({ onNext }) {
  const t = useLang();
  const { name, email, mobile } = useFormData();
  const startLaSign = useLeegalityAgreement();
  const [error, setError] = useState(null);

  const handleLaSign = () => {
    setError(null);

    const popup = window.open(
      "about:blank",
      "leegality-la-esign",
      "width=900,height=820,menubar=no,toolbar=no,location=no,status=no"
    );
    if (!popup) {
      setError("Popup was blocked. Please allow popups for this site and click again.");
      return;
    }
    try {
      popup.document.write(
        `<html><head><title>Leegality eSign — Loan Agreement</title></head>
         <body style="font-family:system-ui,sans-serif;padding:60px;text-align:center;color:#555;background:#f8f5ef;">
           <h3 style="margin:0 0 8px;">Preparing Loan Agreement signing session…</h3>
           <p style="margin:0;opacity:0.7;">Please don't close this window.</p>
         </body></html>`
      );
    } catch { /* ignore */ }

    // Fire-and-forget: kick off Leegality, navigate popup when ready.
    startLaSign({ name, email, mobile })
      .then((res) => {
        const firstSignUrl = res.invitations?.[0]?.signUrl;
        if (!firstSignUrl) throw new Error("No signUrl returned for Invitee 1");
        try { popup.location.href = firstSignUrl; } catch { /* ignore */ }
      })
      .catch((e) => {
        console.error("[Leegality LA] create error:", e);
        try { popup.close(); } catch { /* ignore */ }
      });

    // Advance wizard immediately.
    onNext?.();
  };

  return (
    <QuestionScreen
      title={t.loanAgreement}
      subtitle="One more signature and you're done."
      onNext={handleLaSign}
      nextLabel="eSign loan agreement"
      banner="customer"
      footerNote={error ? `⚠️ ${error}` : undefined}
    >
      <Card>
        <Row label={t.loanAmountLabel} value="₹1,50,000" bold />
        <Row label="Tenure" value="12 months" bold />
        <Row label="Gold pledged" value="80g (22–24K)" bold />
      </Card>
    </QuestionScreen>
  );
}
