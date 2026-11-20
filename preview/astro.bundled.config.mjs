import base from "../astro.config.mjs";

export default {
  ...base,
  outDir: "./versions/c/dist",
  vite: { ...base.vite, ssr: { noExternal: true } },
};
