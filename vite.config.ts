import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "web",
  },
  server: {
    proxy: {
      "^/api/my/.*": {
        target: `${process.env.NUVDEV_HOST}`,
        changeOrigin: true,
      },
    },
  },
});
