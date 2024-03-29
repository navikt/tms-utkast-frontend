import { Alert, BodyLong, Heading, Loader } from "@navikt/ds-react";
import styles from "./Utkast.module.css";
import UtkastList from "@components/UtkastList/UtkastList";
import { text } from "@language/text";
import type { Language } from "@language/language";
import useSWR from "swr";
import { utkastApiUrl } from "src/urls.client";
import { fetcher } from "src/utils/api.client";

export interface UtkastProps {
  loading: boolean;
  utkast: UtkastElement[] | undefined;
  isPartialContent: boolean;
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

interface Props {
  language: Language
}

const Utkast = ({ language }: Props) => {

  const { data: utkastApiData, error, isLoading } = useSWR({url: utkastApiUrl}, fetcher);

  const utkastlist = utkastApiData?.data;
  const isPartialContent = utkastApiData?.statusCode == 207;

  if (error) {
    window.window.location.href = "/error"
  }

  return (
    <div className={styles.container}>
      <div className={styles.utkastWrapper}>
        <div className={styles.utkast}>
          <Heading size={"large"}> {text.hovedoverskrift[language]} </Heading>
          <BodyLong className={styles.ingress} size={"large"}>
            {text.description[language]}
          </BodyLong>
          {!isLoading && isPartialContent ? <Alert variant={"warning"}>{text.partialContent[language]}</Alert> : null}
        </div>
        {isLoading ? (
          <div className={styles.loadingDiv}>
            <Loader id="loader" size="3xlarge" title="venter..." />
          </div>
        ) : (
          <UtkastList utkast={utkastlist} language={language}/>
        )}
      </div>
    </div>
  );
};

export default Utkast;
