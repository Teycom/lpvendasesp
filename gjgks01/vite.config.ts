import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/gjgks01/', // <- Isso garante que todos os assets gerados referenciem o caminho /gjgks01/
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
