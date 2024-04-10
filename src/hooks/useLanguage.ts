import type { Language } from "@language/language";
import { onLanguageSelect, setAvailableLanguages, setParams } from "@navikt/nav-dekoratoren-moduler";
import { useEffect } from "react";

export const useLanguage = (language: Language) => {
  const [_leadingSlash, _basePath, _oldLocale, ...rest] = window.location.pathname.split("/");
  const slug = rest.join("/");
  
  onLanguageSelect((language) => {
    window.sessionStorage.setItem("language", language.locale);
    
    if(language.locale === "nb") {
      window.location.pathname = `/tms-utkast-frontend/${slug}`;
    } else {
      window.location.pathname = `/tms-utkast-frontend/${language.locale}/${slug}`;
    }   
  });

  useEffect(() => {
    setParams({ language: language });
    setAvailableLanguages([
      {
        locale: "nb",
        handleInApp: true,
      },
      {
        locale: "en",
        handleInApp: true,
      },
      {
        locale: "nn",
        handleInApp: true,
      },
    ]);
  }, []);
};
