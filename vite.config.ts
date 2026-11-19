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
      includeAssets: ['icon.svg'],
      manifest: {
        name: '泰國家族旅行 2027',
        short_name: '泰國旅行',
        description: '行程、天氣、緊急資訊與個人資料',
        lang: 'zh-TW',
        theme_color: '#e8772e',
        background_color: '#fbf7f2',
        display: 'standalone',
        start_url: './',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
      workbox: {
        // 離線時仍可打開網站（資料由 localStorage 快取提供）
        navigateFallback: 'index.html',
      },
    }),
  ],
})
