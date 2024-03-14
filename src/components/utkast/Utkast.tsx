import { useContext } from "react";
import { Alert, BodyLong, Heading, Ingress, Loader } from "@navikt/ds-react";
import styles from "./Utkast.module.css";
import UtkastList from "./utkast-list/UtkastList";
import { text } from "../../language/text";
import type { Language } from "../../language/language";
import { useLanguage } from "../../hooks/useLanguage";

export interface UtkastProps {
  loading: boolean;
  utkast: UtkastElement[] | undefined;
  isPartialContent: boolean;
  language: Language
}

export interface UtkastElement {
  tittel: string;
  link: string;
  utkastId: string;
  opprettet: string;
  sistEndret: string;
  metrics?: MetricValues | null;
}

export interface MetricValues {
  skjemakode: string;
  skjemanavn: string;
}

const Utkast = ({ utkast, loading, isPartialContent, language }: UtkastProps) => {

  useLanguage(language)

  return (
    <div className={styles.container}>
      <div className={styles.utkastWrapper}>
        <div className={`${styles.utkast} ${styles.tekstinnhold}`}>
          <Heading size={"large"}> {text.hovedoverskrift[language]} </Heading>
          <BodyLong className={styles.ingress} size={"large"}>
            {text.description[language]}
          </BodyLong>
          {!loading && isPartialContent ? <Alert variant={"warning"}>{text.partialContent[language]}</Alert> : null}
        </div>
        {loading ? (
          <div className={styles.loadingDiv}>
            <Loader id="loader" size="3xlarge" title="venter..." />
          </div>
        ) : (
          <UtkastList utkast={utkast} language={language}/>
        )}
      </div>
    </div>
  );
};

export default Utkast;