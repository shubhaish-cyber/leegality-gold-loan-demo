import GuideInterstitial from "../../components/shared/GuideInterstitial";
import GUIDE from "../../constants/guide";

export default function Guide({ onNext }) {
  return <GuideInterstitial variant="entry" action={GUIDE.application.action} onNext={onNext} />;
}
