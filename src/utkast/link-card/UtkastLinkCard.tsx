import { LinkCard, Tag } from "@navikt/ds-react";
import type { Language } from "@src/shared/language/language";
import { logEvent } from "@src/shared/utils/analytics";
import dayjs from "dayjs";
import styles from "../Utkast.module.css";
import { text } from "../utkastText";
import type { UtkastElement } from "../utkastTypes";

interface UtkastLinkCardProps {
  utkast: UtkastElement;
  language: Language;
}

export default function UtkastLinkCard({ utkast, language }: UtkastLinkCardProps) {
  const dateFormatter = (date: string) => dayjs(date).format("DD.MM.YYYY");

  return (
    <LinkCard onClick={() => logEvent("utkast-åpnet")} data-color="accent" className={styles.linkCard}>
      <LinkCard.Title>
        <LinkCard.Anchor href={utkast.link}>{utkast.tittel}</LinkCard.Anchor>
      </LinkCard.Title>
      <LinkCard.Description>
        {text.opprettet[language]} {dateFormatter(utkast.opprettet)}
      </LinkCard.Description>
      {utkast.slettesEtter && (
        <LinkCard.Footer>
          <Tag variant="moderate" data-color="neutral" size="small">
            {`${text.slettes[language]} ${dateFormatter(utkast.slettesEtter)}`}
          </Tag>
        </LinkCard.Footer>
      )}
    </LinkCard>
  );
}
