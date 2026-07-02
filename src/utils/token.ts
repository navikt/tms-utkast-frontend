import { requestOboToken } from "@navikt/oasis";
import { isLocal } from "./environment";

const audience = `${process.env.NAIS_CLUSTER_NAME}:min-side:tms-utkast`;

type Logger = { error: (message: string) => void };

export const getOboToken = async (
  token: string,
  logger: Logger,
): Promise<string> => {
  const oboResult = await requestOboToken(token, audience);

  if (isLocal) {
    return "Fake token";
  }

  if (!oboResult.ok) {
    logger.error("Error getting access token: " + oboResult.error);
    throw new Error("Request oboToken for tms-utkast failed.");
  }

  return oboResult.token;
};
