import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',         // ✅ правильный путь — внутри проекта
    emptyOutDir: true
  }
});
