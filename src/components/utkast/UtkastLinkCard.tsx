import { LinkCard, Tag } from "@navikt/ds-react";
import type { Language } from "@src/language/language";
import { text } from "@src/language/text";
import dayjs from "dayjs";
import type { UtkastElement } from "./UtkastTypes";

interface UtkastLinkCardProps {
  utkast: UtkastElement;
  language: Language;
}

export default function UtkastLinkCard({
  utkast,
  language,
}: UtkastLinkCardProps) {
  const dateFormatter = (date: string) => dayjs(date).format("DD.MM.YYYY");

  return (
    <LinkCard data-analytics-id="utkast-åpnet">
      <LinkCard.Title>
        <LinkCard.Anchor href={utkast.link}>{utkast.tittel}</LinkCard.Anchor>
      </LinkCard.Title>
      <LinkCard.Footer>
        <Tag variant="moderate" data-color="info" size="medium">
          {`${text.opprettet[language]} ${dateFormatter(utkast.opprettet)}`}
        </Tag>
      </LinkCard.Footer>
    </LinkCard>
  );
}
