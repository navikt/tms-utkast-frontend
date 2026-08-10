import dayjs from "dayjs";
import type { UtkastElement } from "./utkastTypes";

export const fetchUtkast = async (oboToken: string, url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${oboToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Http error with status: ${response.status}`);
  }

  return await response.json();
};

export const sortByOpprettet = (a: UtkastElement, b: UtkastElement) =>
  dayjs(a.opprettet).isAfter(dayjs(b.opprettet)) ? -1 : 1;

export const isIngen = (utkast: UtkastElement[]) => utkast.length === 0;
