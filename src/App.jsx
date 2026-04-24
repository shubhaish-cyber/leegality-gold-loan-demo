import { useState } from "react";
import { LangCtx } from "./context/LangContext";
import { FormCtx } from "./context/FormContext";
import { SUB_SCREENS } from "./constants/subScreens";
import C from "./constants/colors";
import ScreenTransition from "./components/animations/ScreenTransition";
import Ribbon from "./components/shared/Ribbon";
import Header from "./components/shared/Header";
import NavBar from "./components/shared/NavBar";
import ProgressBar from "./components/shared/ProgressBar";
import DotTimeline from "./components/shared/DotTimeline";
import { useLang } from "./context/LangContext";

// Sub-screen components
import HomeWelcome from "./subscreens/home/Welcome";
import HomeFlow from "./subscreens/home/Flow";
import LanguageSelect from "./subscreens/language/Select";
import AppGuide from "./subscreens/application/Guide";
import AppName from "./subscreens/application/Name";
import AppEmail from "./subscreens/application/Email";
import AppMobile from "./subscreens/application/Mobile";
import ValGuide from "./subscreens/valuation/Guide";
import ValItems from "./subscreens/valuation/Items";
import SancHandoff from "./subscreens/sanction/Handoff";
import SancTerms from "./subscreens/sanction/Terms";
import AgrGuide from "./subscreens/agreement/Guide";
import AgrReview from "./subscreens/agreement/Review";
import SucCelebrate from "./subscreens/success/Celebrate";

// Static map from sub-screen key → component.
// Keys must match /src/constants/subScreens.js exactly.
const COMPONENTS = {
  "home-welcome": HomeWelcome,
  "home-flow": HomeFlow,
  language: LanguageSelect,
  "application-guide": AppGuide,
  "application-name": AppName,
  "application-email": AppEmail,
  "application-mobile": AppMobile,
  "valuation-guide": ValGuide,
  "valuation-items": ValItems,
  "sanction-handoff": SancHandoff,
  "sanction-terms": SancTerms,
  "agreement-guide": AgrGuide,
  "agreement-review": AgrReview,
  "success-celebrate": SucCelebrate,
};

// Sticks to the very bottom of the viewport on every screen: white bg,
// light-grey text — subtle brand footer reminder that this is an illustration.
function BottomRibbon() {
  const t = useLang();
  return (
    <Ribbon
      text={t.homeRibbon}
      bg={C.white}
      color={C.gray}
    />
  );
}

// Top chrome: Header + DotTimeline.
// Rendered ABOVE every sub-screen whose `chrome: true` in SUB_SCREENS.
function TopChrome({ subIdx, active }) {
  return (
    <>
      <Header
        right={
          <span style={{ fontSize: 11, color: C.gray }}>
            {subIdx + 1} / {SUB_SCREENS.length}
          </span>
        }
      />
      <DotTimeline currentPhase={active.phase} />
    </>
  );
}

export default function App() {
  const [subIdx, setSubIdx] = useState(0);

  // Form data (shared across screens for Leegality API)
  const [name, setName] = useState("Ramesh Kumar Sharma");
  const [email, setEmail] = useState("ramesh.sharma@gmail.com");
  const [mobile, setMobile] = useState("+91 98765 43210");

  // Language
  const [lang, setLang] = useState("en");

  // Direction controls vertical-slide variant in ScreenTransition
  const [direction, setDirection] = useState("forward");

  const next = () => {
    setSubIdx((i) => {
      if (i < SUB_SCREENS.length - 1) {
        setDirection("forward");
        return i + 1;
      }
      return i;
    });
  };

  const back = () => {
    setSubIdx((i) => {
      if (i > 0) {
        setDirection("back");
        return i - 1;
      }
      return i;
    });
  };

  const reset = () => {
    setDirection("forward");
    setSubIdx(0);
    setLang("en");
    setName("Ramesh Kumar Sharma");
    setEmail("ramesh.sharma@gmail.com");
    setMobile("+91 98765 43210");
  };

  const active = SUB_SCREENS[subIdx];
  const Active = COMPONENTS[active.key];

  return (
    <LangCtx.Provider value={{ lang, setLang }}>
      <FormCtx.Provider value={{ name, email, mobile, setName, setEmail, setMobile }}>
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            height: "100vh",
            background: "#f8f5ef",
            position: "relative",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {active.chrome && !active.guide && (
            <TopChrome subIdx={subIdx} active={active} />
          )}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <ScreenTransition screenKey={active.key} direction={direction}>
              <Active onNext={next} onBack={back} onReset={reset} />
            </ScreenTransition>
          </div>
          {active.chrome && (
            <ProgressBar currentIdx={subIdx} total={SUB_SCREENS.length} />
          )}
          {active.chrome && <NavBar onBack={back} onReset={reset} />}
          <BottomRibbon />
        </div>
      </FormCtx.Provider>
    </LangCtx.Provider>
  );
}
