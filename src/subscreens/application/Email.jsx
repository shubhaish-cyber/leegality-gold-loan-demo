import C from "../../constants/colors";
import QuestionScreen from "../../components/shared/QuestionScreen";
import EditableField from "../../components/shared/EditableField";
import { useLang } from "../../context/LangContext";
import { useFormData } from "../../context/FormContext";

function isEmailish(v) {
  return /.+@.+\..+/.test((v || "").trim());
}

export default function Email({ onNext }) {
  const t = useLang();
  const { email, setEmail } = useFormData();

  return (
    <QuestionScreen
      title={`Customer's ${t.email.toLowerCase()}?`}
      subtitle="We'll send the signed documents and audit trail here."
      onNext={onNext}
      canAdvance={isEmailish(email)}
      banner="agent"
    >
      <EditableField label={t.email} value={email} onChange={setEmail} type="email" last />
      <div
        style={{
          marginTop: 14,
          background: C.purpleLight,
          border: `1px solid ${C.purple}`,
          borderRadius: 8,
          padding: "10px 12px",
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>ℹ️</span>
        <span style={{ fontSize: 12, color: C.purpleDark, lineHeight: 1.5 }}>
          {t.esignNote}
        </span>
      </div>
    </QuestionScreen>
  );
}
