import logger from "@src/utils/server/logger";
import { defineMiddleware } from "astro/middleware";
import { isLocal } from "../utils/server/environment";
import { validateIdportenToken } from "./auth/validate";
import { loginUrl } from "./urls";
import { isInternal } from "./utils";

export const onRequest = defineMiddleware(async (context, next) => {
  const bearerToken: string | null | undefined =
    context.request.headers.get("authorization");
  const params = encodeURIComponent(context.url.search);

  if (isLocal) {
    return next();
  }

  if (isInternal(context)) {
    return next();
  }

  if (!bearerToken) {
    logger.info(
      "Could not find any bearer token on the request. Redirecting to login.",
    );
    return context.redirect(`${loginUrl}${params}`);
  }

  const validationResult = await validateIdportenToken(bearerToken);

  if (validationResult !== "valid") {
    const error = new Error(
      `Invalid JWT token found (cause: ${validationResult.errorType} ${validationResult.message}, redirecting to login.`,
    );
    logger.error(error);
    return context.redirect(`${loginUrl}${params}`);
  }

  context.locals.token = bearerToken;

  return next();
});
