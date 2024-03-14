import { ChevronRightIcon } from "@navikt/aksel-icons";
import { BodyLong, BodyShort, Heading } from "@navikt/ds-react";
import dayjs from "dayjs";
import { useContext } from "react";
import { PencilIcon } from '@navikt/aksel-icons';
import { text } from "../../../language/text";
import { logAmplitudeEvent } from "../../../utils/amplitude";
import { sortByOpprettet } from "../../../utils/sorting";
import EmptyUtkastList from "../empty-utkast-list/EmptyUtkastList";
import { type UtkastElement } from "../Utkast";
import styles from "./UtkastList.module.css";
import { type Language } from "../../../language/language";
import { useLanguage } from "../../../hooks/useLanguage";

export interface UtkastListProps {
  utkast: UtkastElement[] | undefined;
  language: Language;
}

interface UtkastListElementProps {
  utkast: UtkastElement;
  key: string;
  language: Language;
}

const UtkastList = ({ utkast, language }: UtkastListProps) => {
  useLanguage(language)
  const listIsEmpty = utkast != undefined && utkast.length == 0;

  return listIsEmpty ? (
    <EmptyUtkastList language={language}/>
  ) : (
    <ul className={`${styles.utkastList} ${styles.tekstinnhold}`} data-testid="utkastlist">
      {utkast?.sort(sortByOpprettet).map((u) => <UtkastListElement language={language} utkast={u} key={u.utkastId} />)}
    </ul>
  );
};

export const UtkastListElement = ({ utkast, language }: UtkastListElementProps) => {
  const dateFormatter = (date: string) => dayjs(date).format("DD.MM.YYYY");

  return (
    <li key={utkast.utkastId} className={styles.container}>
      <a href={utkast.link} className={styles.link} onClick={() => logAmplitudeEvent(utkast.link, utkast.metrics)}>
        <div className={styles.top}>
          <div className={styles.wrapper}>
            <div className={styles.ikon}>
              <PencilIcon aria-hidden={true} />
            </div>
            <BodyShort size="medium" className={styles.utkastNavn}>
              {text.hovedoverskrift[language]}
            </BodyShort>
          </div>
          <div className={`${styles.wrapper} ${styles.endretTekst}`}>
            <BodyLong size="small">{text.opprettet[language] + dateFormatter(utkast.opprettet)}</BodyLong>
            <ChevronRightIcon className={styles.chevron} fontSize="1.25rem" aria-hidden={true} aria-label="Chevron" />
          </div>
        </div>
        <div className={styles.bottom}>
          <Heading size="xsmall" level="2" className={styles.utkastTittel}>
            {utkast.tittel}
          </Heading>
        </div>
      </a>
    </li>
  );
};

export default UtkastList;