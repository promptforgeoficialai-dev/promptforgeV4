import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {} // ESTA LÍNEA ES LA QUE QUITA LA PANTALLA AZUL
  }
})