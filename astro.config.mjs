import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://micheler2d.github.io",
  base: "/Passion",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport"
  },
  build: {
    inlineStylesheets: "auto"
  },
  compressHTML: true
});
