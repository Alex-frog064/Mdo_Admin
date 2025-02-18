import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy: {
      '/veterinario':{
        target: 'https://api-mascoticobereal.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
