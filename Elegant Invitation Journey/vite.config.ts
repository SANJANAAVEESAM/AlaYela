import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  server: {
    port: 8080,
    // Bind to every interface so a phone on the same Wi-Fi can reach the dev server.
    host: true,
  },
  css: {
    transformer: "lightningcss",
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      server: { entry: "server" },
    }),
    // Nitro provides the production server build; the dev server doesn't need it.
    // Vercel sets VERCEL=1 during its build. Locally we stay on node-server so
    // `node .output/server/index.mjs` keeps working for checking a real build.
    ...(command === "build"
      ? [nitro({ preset: process.env.VERCEL ? "vercel" : "node-server" })]
      : []),
    viteReact(),
  ],
}));
