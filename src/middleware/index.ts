import { REDIRECT_URI } from "astro:env/server";
import { getToken, validateToken } from "@navikt/oasis";
import { defineMiddleware } from "astro/middleware";
import { isLocal } from "../utils/environment";
import logger from "../utils/logger";
import { isInternal } from "./utils";

export const onRequest = defineMiddleware(async (context, next) => {
  const token = getToken(context.request.headers);
  const params = encodeURIComponent(context.url.search);
  const loginUrl = `/minside/utkast/oauth2/login?redirect=${REDIRECT_URI}`;

  if (isLocal) {
    return next();
  }

  if (isInternal(context)) {
    return next();
  }

  if (!token) {
    logger.info(
      "Could not find any bearer token on the request. Redirecting to login.",
    );
    return context.redirect(`${loginUrl}${params}`);
  }

  const validation = await validateToken(token);

  if (!validation.ok) {
    console.info("Validation of token failed. Redirecting to login");
    return context.redirect(`${loginUrl}${params}`);
  }

  context.locals.token = token;

  return next();
});
