import QuestionScreen from "../../components/shared/QuestionScreen";
import EditableField from "../../components/shared/EditableField";
import { useLang } from "../../context/LangContext";
import { useFormData } from "../../context/FormContext";

function hasEnoughDigits(v) {
  return ((v || "").match(/\d/g) || []).length >= 10;
}

export default function Mobile({ onNext }) {
  const t = useLang();
  const { mobile, setMobile } = useFormData();

  return (
    <QuestionScreen
      title={`Customer's ${t.mobile.toLowerCase()}?`}
      subtitle="SMS and WhatsApp confirmations will go to this number."
      onNext={onNext}
      canAdvance={hasEnoughDigits(mobile)}
      banner="agent"
    >
      <EditableField label={t.mobile} value={mobile} onChange={setMobile} type="tel" last />
    </QuestionScreen>
  );
}
