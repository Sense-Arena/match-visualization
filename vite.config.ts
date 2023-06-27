import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { comlink } from 'vite-plugin-comlink';
import dts from 'vite-plugin-dts';
import { peerDependencies } from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
    },
  },
  plugins: [
    vanillaExtractPlugin(),
    react({
      jsxRuntime: 'classic',
    }),
    dts({
      outputDir: path.resolve(__dirname, 'dist/types'),
      exclude: ['**/stories/**'],
      entryRoot: path.resolve(__dirname, 'src/index.ts'),
      afterDiagnostic: console.debug,
      skipDiagnostics: false,
      copyDtsFiles: true,
    }),
    comlink(),
    mode === 'test' &&
      visualizer({
        emitFile: true,
      }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'MV',
      formats: ['es', 'umd'],
      fileName: format => `@sa-mv.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies)],
    },
  },
  worker: {
    plugins: [comlink()],
  },
}));
