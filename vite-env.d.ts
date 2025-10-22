import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // Fix: Expose environment variables to the client-side code.
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
})
