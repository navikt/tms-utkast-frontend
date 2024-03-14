import { BodyLong, Heading } from "@navikt/ds-react";
import TomtKatt from "../../../img/TomtKatt";
import styles from "./EmptyUtkastList.module.css";
import { text } from "../../../language/text";
import { useLanguage } from "../../../hooks/useLanguage";
import { type Language } from "../../../language/language";
import type { UtkastElement } from "../Utkast";

interface Props {
  language: Language;
}

const EmptyUtkastList = ({language}: Props) => {
  useLanguage(language);
  return (
    <div className={`${styles.ingenUtkast} ${styles.tekstinnhold}`}>
      <div className={styles.ingenUtkastTekst}>
        <Heading size="small" level="2">
          {text.ingenUtkastTittel[language]}
        </Heading>
        <BodyLong size="medium">{text.ingenUtkastIngress[language]}</BodyLong>
        <a href={"https://www.nav.no/tjenester"} className={styles.lenke}>
          {" "}
          {text.ingenUtkastLenketekst[language]}
        </a>
      </div>
      <TomtKatt alt={text.emptyKitten[language]} />
    </div>
  );
};

export default EmptyUtkastList;
