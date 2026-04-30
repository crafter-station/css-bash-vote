import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import clerk from "@clerk/astro";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [clerk(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
