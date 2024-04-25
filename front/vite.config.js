import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    outDir: "dist", // Specify the output directory for the built files
    rollupOptions: {
      input: {
        main: "index.html" // Specify the path to the HTML file relative to the Vite config file
      }
    }
  }
});
