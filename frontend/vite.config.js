import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // This is crucial for React Router to work on refresh
    historyApiFallback: true,
  },
});
