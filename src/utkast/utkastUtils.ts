import dayjs from "dayjs";
import type { UtkastElement } from "./utkastTypes";

export const sortByOpprettet = (a: UtkastElement, b: UtkastElement) =>
  dayjs(a.opprettet).isAfter(dayjs(b.opprettet)) ? -1 : 1;
