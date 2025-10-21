import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // FIX: Expose API_KEY to the client-side code. This is necessary because Vite 
  // does not expose process.env by default, and the app requires it for the Gemini API.
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
