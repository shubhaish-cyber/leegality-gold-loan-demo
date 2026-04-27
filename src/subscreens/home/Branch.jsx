import GuideInterstitial from "../../components/shared/GuideInterstitial";

export default function Branch({ onNext }) {
  return (
    <GuideInterstitial
      variant="entry"
      action="Borrower walks into the branch with Gold and applies via branch device."
      nextLabel="Get Started"
      onNext={onNext}
    />
  );
}
