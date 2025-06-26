import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT ?? '5173') || 5173,  // for dev
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT ?? '4173') || 4173,  // for preview
    allowedHosts: ['routecast.onrender.com']
  }

})
