import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://passionfitness.it",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport"
  },
  build: {
    inlineStylesheets: "auto"
  },
  compressHTML: true
});
