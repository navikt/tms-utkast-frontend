import {LinkCard, Tag} from "@navikt/ds-react";
import type { Language } from "@src/shared/language/language";
import { logEvent } from "@src/shared/utils/analytics";
import styles from "../Utkast.module.css";
import { text } from "../utkastText";
import {EyeSlashIcon} from "@navikt/aksel-icons";

interface LanguageProps {
    language: Language;
}
const link = "/minside/oauth2/login?level=idporten-loa-high"
export default function UtkastLinkCardMasked({ language }: LanguageProps){

    return (
        <LinkCard
            onClick={() => logEvent("utkast-masked-åpnet", text.maskedUtkastTittel[language], link)}
            data-color="accent"
            className={styles.linkCard}
        >
            <LinkCard.Title>
                <LinkCard.Anchor href={link}>{text.maskedUtkastTittel[language]}</LinkCard.Anchor>
            </LinkCard.Title>
            <LinkCard.Description>
                {text.maskedUtkastBeskrivelse[language]}
            </LinkCard.Description>
            <LinkCard.Footer>
                <Tag
                    variant={"moderate"}
                    data-color={"neutral"}
                    size={"small"}
                    icon={<EyeSlashIcon aria-hidden={true} />}
                >
                    {text.maskedUtkastStatus[language]}
                </Tag>
            </LinkCard.Footer>
        </LinkCard>
    );
}