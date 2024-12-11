import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindscss from 'tailwindcss'


export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindscss()],
    },
  },
})
