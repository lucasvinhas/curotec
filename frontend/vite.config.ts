import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,      // Default Vite port, ensure this matches docker-compose.override.yml
    // Optional: for HMR polling if filesystem events don't work well in Docker
    // watch: {
    //   usePolling: true,
    // },
  }
})
