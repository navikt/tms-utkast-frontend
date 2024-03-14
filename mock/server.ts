import { setupServer } from "msw/node";
import { handlersNoContent } from "./noContent";

export const server = setupServer(...handlersNoContent);
