import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@community-quests-form/core':  "../core/src",
      '@community-quests-form/types': "../core/src/types/*",
    }
  }
})
