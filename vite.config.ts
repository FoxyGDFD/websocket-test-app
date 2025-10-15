import path, { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
/// <reference types="vitest" />
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    test: {
      setupFiles: './setupTest.ts',
      globals: true,
      environment: 'jsdom',
      path: ['**/*.test.ts', '**/*.test.tsx'],
      coverage: {
        provider: 'v8',
      },
      reporters: ['junit', 'default'],
      outputFile: './junit.xml',
    },
    plugins: [
      TanStackRouterVite({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: resolve(__dirname, './src/pages'),
        generatedRouteTree: resolve(
          __dirname,
          './src/app/providers/route-tree.gen.ts'
        ),
      }),
      tailwindcss(),
      react(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@app': path.resolve(__dirname, './src/app'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@widgets': path.resolve(__dirname, './src/widgets'),
        '@entities': path.resolve(__dirname, './src/entities'),
        '@features': path.resolve(__dirname, './src/features'),
        '@shared': path.resolve(__dirname, './src/shared'),
        '@env': path.resolve(__dirname, './src/shared/lib/env'),
      },
    },
    server: {
      port: parseInt(env.PORT) ?? 5173,
      proxy: {
        [env.VITE_SERVER_API_URL]: {
          target: env.SERVER_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
