import { setupWorker } from "msw/browser";
import { handlersAllContent } from "./allContent";

export const worker = setupWorker(...handlersAllContent);
