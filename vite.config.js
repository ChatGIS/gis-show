import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/gis-show/',
  plugins: [vue()],
  server: {
    port: 13010
  }
})
