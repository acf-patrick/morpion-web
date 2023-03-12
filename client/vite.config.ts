import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
      proxy: {
        "/api": {
          target: mode === "production" ? "https://morpion-epc0.onrender.com" : "http://localhost:8000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});