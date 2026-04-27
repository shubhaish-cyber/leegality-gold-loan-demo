import GuideInterstitial from "../../components/shared/GuideInterstitial";
import GUIDE from "../../constants/guide";

export default function Guide({ onNext }) {
  return (
    <GuideInterstitial
      variant="entry"
      action={GUIDE.valuation.action}
      sub={GUIDE.valuation.sub}
      onNext={onNext}
    />
  );
}
