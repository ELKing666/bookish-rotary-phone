import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LANGUAGES, translations, type Lang } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations.ar;
  dir: "rtl" | "ltr";
};

const LanguageContext = createContext<Ctx>({
  lang: "ar", setLang: () => {}, t: translations.ar, dir: "rtl",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  const dir = translations[lang].dir;

  function setLang(l: Lang) {
    setLangState(l);
  }

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang, dir]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() { return useContext(LanguageContext); }
