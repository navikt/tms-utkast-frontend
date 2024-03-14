import { useEffect } from "react";
import { onLanguageSelect, setAvailableLanguages } from "@navikt/nav-dekoratoren-moduler";
import type { Language } from "../language/language";

export const useLanguage = (language: Language) => {
  const [_leadingSlash, _basePath, _oldLocale, ...rest] = window.location.pathname.split("/");
  const slug = rest.join("/");

  onLanguageSelect((language) => {
    window.sessionStorage.setItem("language", language.locale);
    window.location.pathname = `/minside/${language.locale}/${slug}`;
  });

  useEffect(() => {
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
