import { InfoCard } from "@navikt/ds-react";
import type { Language } from "@src/shared/language/language";
import { text } from "./utkastText";

interface UtkastInfoCardProps {
  language: Language;
}

export default function UtkastInfoCard({ language }: UtkastInfoCardProps) {
  return (
    <InfoCard data-color="info">
      <InfoCard.Header>
        <InfoCard.Title>{text.infoTittel[language]}</InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>{text.infoTekst[language]}</InfoCard.Content>
    </InfoCard>
  );
}
