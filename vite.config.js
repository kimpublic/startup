import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
    '/send-email': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
    }
  },
});


