import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Expose the API_KEY environment variable to the client-side code.
  // This is a more direct and robust method than using loadEnv.
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
})