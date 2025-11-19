import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api/users': 'http://user-service:8001',
      '/api/products': 'http://product-service:8002',
      '/api/orders': 'http://order-service:8003',
      '/api/notifications': 'http://notification-service:8004',
      '/api/analytics': 'http://analytics-service:8005',
    }
  }
})
