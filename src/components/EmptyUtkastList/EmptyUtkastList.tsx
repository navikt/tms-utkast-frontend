import { BodyLong, Heading } from "@navikt/ds-react";
import TomtKatt from "../../img/TomtKatt";
import styles from "./EmptyUtkastList.module.css";
import { text } from "../../language/text";

const EmptyUtkastList = () => {
  return (
    <div className={`${styles.ingenUtkast} ${styles.tekstinnhold}`}>
      <div className={styles.ingenUtkastTekst}>
        <Heading size="small" level="2">
          {text.ingenUtkastTittel["nb"]}
        </Heading>
        <BodyLong size="medium">{text.ingenUtkastIngress["nb"]}</BodyLong>
        <a href={"https://www.nav.no/tjenester"} className={styles.lenke}>
          {" "}
          {text.ingenUtkastLenketekst["nb"]}
        </a>
      </div>
      <TomtKatt alt={text.emptyKitten["nb"]} />
    </div>
  );
};

export default EmptyUtkastList;
