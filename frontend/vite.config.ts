import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080, // Set frontend port to 8080
    strictPort: true, // Fail if port 8080 is occupied
    proxy: {
      "/api": {
        target: "http://localhost:9090", // Spring Boot backend port
        changeOrigin: true,
      },
    },
  },
});
