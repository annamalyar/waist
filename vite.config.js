import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // ⚠️ Не забудьте этот импорт

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✅ Добавьте это
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
