import { HttpResponse, http } from "msw";
import { utkastApiUrl } from "../src/urls";

const ingenUtkastHandler = () => {
  return [
    http.get(utkastApiUrl, () => {
      return HttpResponse.json([]);
    }),
  ];
};

export const handlersNoContent = [...ingenUtkastHandler()];
