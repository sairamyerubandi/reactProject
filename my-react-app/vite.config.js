import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // The backend doesn't send CORS headers, so the browser has to reach it through Vite
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})