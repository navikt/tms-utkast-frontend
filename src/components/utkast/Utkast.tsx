import UtkastList from "@components/utkast-list/UtkastList.tsx";
import type { Language } from "@language/language.ts";
import { text } from "@language/text.ts";
import { Alert, Loader } from "@navikt/ds-react";
import { baseUrl } from "@src/utils/client/urls.ts";
import { fetcher } from "@src/utils/client/api.ts";
import useSWR from "swr";
import styles from "./Utkast.module.css";

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

  const { data: utkastApiData, error, isLoading } = useSWR({url: "utkastApiUrl"}, fetcher);

  const utkastlist = utkastApiData?.data;
  const isPartialContent = utkastApiData?.statusCode == 207;

  if (error) {
    window.window.location.href = `${baseUrl}/error`
  }

  return (
    <>
      <div className={styles.utkast}>
        {!isLoading && isPartialContent ? <Alert variant={"warning"}>{text.partialContent[language]}</Alert> : null}
      </div>
      {isLoading ? (
        <div className={styles.loadingDiv}>
          <Loader id="loader" size="3xlarge" title="venter..." />
        </div>
      ) : (
        <UtkastList utkast={utkastlist} language={language}/>
      )}
    </>
  );
};

export default Utkast;
