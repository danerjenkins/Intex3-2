import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL;
  return {
    plugins: [react()],
    server: {
      port: 3000,
      'Content-Security-Policy': [
        "default-src 'none'", // Block everything by default
        "script-src 'self'", // Only allow scripts from your origin
        "style-src 'self'", // Only local styles, no inline
        "img-src 'self'", // Only images from same origin
        `connect-src 'self' ${apiUrl}`, // Only connect to your backend
        "font-src 'none'", // Block web fonts
        "media-src 'none'", // No video/audio
        "frame-ancestors 'none'", // Disallow iframe embedding
        "object-src 'none'", // Disallow Flash, plugins
        "base-uri 'none'", // Disallow <base> tag
        "form-action 'self'", // Only allow submitting forms to self
      ].join('; '),
    },
  };
});
