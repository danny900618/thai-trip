import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // 相對路徑：部署到 GitHub Pages / Vercel / Netlify 子路徑都能用
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'manifest.webmanifest'],
      manifest: false, // 使用 public/manifest.webmanifest
      workbox: {
        // 離線時仍可打開網站（資料由 localStorage 快取提供）
        navigateFallback: 'index.html',
      },
    }),
  ],
})
