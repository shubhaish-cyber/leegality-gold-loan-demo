import QuestionScreen from "../../components/shared/QuestionScreen";
import EditableField from "../../components/shared/EditableField";
import { useLang } from "../../context/LangContext";
import { useFormData } from "../../context/FormContext";

export default function Name({ onNext }) {
  const t = useLang();
  const { name, setName } = useFormData();

  return (
    <QuestionScreen
      title={`What's the customer's ${t.fullName.toLowerCase()}?`}
      subtitle="We'll use this in the signed loan documents."
      onNext={onNext}
      canAdvance={Boolean(name?.trim())}
      banner="agent"
    >
      <EditableField label={t.fullName} value={name} onChange={setName} last />
    </QuestionScreen>
  );
}
