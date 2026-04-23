import GuideInterstitial from "../../components/shared/GuideInterstitial";
import GUIDE from "../../constants/guide";

export default function Guide({ onNext }) {
  return <GuideInterstitial variant="entry" action={GUIDE.agreement.action} onNext={onNext} />;
}
