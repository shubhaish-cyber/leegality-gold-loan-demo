import { createContext, useContext } from "react";
import T from "../translations";

export const LangCtx = createContext({ lang: "en", setLang: () => {} });

export function useLang() {
  const { lang } = useContext(LangCtx);
  return T[lang] || T.en;
}

export function useLangCode() {
  const { lang, setLang } = useContext(LangCtx);
  return { lang, setLang };
}
