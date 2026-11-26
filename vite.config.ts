/// <reference types="vitest" />
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function collectDistFiles(dir: string, rootDir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectDistFiles(full, rootDir));
    } else if (
      !entry.name.endsWith('.map') &&
      entry.name !== 'sw.js' &&
      entry.name !== 'precache-manifest.json'
    ) {
      const rel = '/' + path.relative(rootDir, full).replace(/\\/g, '/');
      results.push(rel);
    }
  }
  return results;
}

function offlinePrecachePlugin(): Plugin {
  return {
    name: 'toolnest-offline-precache',
    apply: 'build',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(outDir)) return;
      const assets = collectDistFiles(outDir, outDir);
      const manifest = { version: '2.9.0', assets };
      fs.writeFileSync(
        path.join(outDir, 'precache-manifest.json'),
        JSON.stringify(manifest, null, 2)
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), offlinePrecachePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          lucide: ['lucide-react'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
