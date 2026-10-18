import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false,
      },
      includeAssets: ['favicon-16.png', 'favicon-32.png', 'favicon.png', 'icon/ios/apple-touch-icon-180.png'],
      manifest: {
        name: 'KorpaBee',
        short_name: 'KorpaBee',
        description: 'All-in-one social, opportunity, and lifestyle platform built to power your service year — from camp to POP and beyond.',
        start_url: '/login',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f8f7fd',
        theme_color: '#3c0ca0',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
      },
    }),
  ],
  server: {
    port: 5176,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
