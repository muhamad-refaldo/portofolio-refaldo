import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa' 

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
    
    
    VitePWA({
      registerType: 'autoUpdate', 
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Portofolio Muhamad Refaldo',
        short_name: 'Refaldo',
        description: 'Portfolio of Muhamad Refaldo - Fullstack Developer & Business Owner',
        theme_color: '#050505',
        background_color: '#050505',
        display: 'standalone', 
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png', 
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', 
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  
  
  define: {
    __firebase_config: undefined,
    __initial_auth_token: undefined,
    __app_id: JSON.stringify("portfolio-dev")
  }
})