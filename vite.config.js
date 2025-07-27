import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  server: {
    port: process.env.PORT || 5173, 
    host: '0.0.0.0',
  },
  preview: {
    allowedHosts: ['adminpanelfrontend-2xqk.onrender.com'],  
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@config': path.resolve(__dirname, './src/config'),
    },
  },
});
