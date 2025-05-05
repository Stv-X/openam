import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: tag => ['apple-music-playback-controls', 'apple-music-progress', 'apple-music-artwork', 'apple-music-volume'].includes(tag)
      }
    }
  })],
})
