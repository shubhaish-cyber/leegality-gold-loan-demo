import GuideInterstitial from "../../components/shared/GuideInterstitial";
import GUIDE from "../../constants/guide";

export default function Handoff({ onNext }) {
  return (
    <GuideInterstitial
      variant="handoff"
      action={GUIDE.sanction.action}
      nextLabel="See RBI-compliant KFS flow"
      onNext={onNext}
    />
  );
}
