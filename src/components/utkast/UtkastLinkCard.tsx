import { LinkCard, Tag } from "@navikt/ds-react";
import type { Language } from "@src/language/language";
import { text } from "@src/language/text";
import { logEvent } from "@src/utils/analytics";
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
    <LinkCard onClick={() => logEvent("utkast-åpnet")}>
      <LinkCard.Title>
        <LinkCard.Anchor href={utkast.link}>{utkast.tittel}</LinkCard.Anchor>
      </LinkCard.Title>
      <LinkCard.Description>
        {text.opprettet[language]} {dateFormatter(utkast.opprettet)}
      </LinkCard.Description>
      {utkast.sistEndret && (
        <LinkCard.Footer>
          <Tag variant="moderate" data-color="info" size="medium">
            {`${text.slettes[language]} ${dateFormatter(utkast.slettesEtter)}`}
          </Tag>
        </LinkCard.Footer>
      )}
    </LinkCard>
  );
}
