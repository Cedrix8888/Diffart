import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { API_CONFIG } from './config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
      target: API_CONFIG.backendUrl,
      changeOrigin: true,
      }
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'proxy_url',
    ],
  },
})
