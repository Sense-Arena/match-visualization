import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type UserConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import packageJson from './package.json' with { type: 'json' };

const { peerDependencies } = packageJson;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      src: path.resolve(import.meta.dirname, './src'),
      '@core': path.resolve(import.meta.dirname, './src/core'),
    },
  },
  plugins: [
    vanillaExtractPlugin(),
    react(),
    ...[
      dts({
        outDirs: [
          { dir: 'dist', moduleFormat: 'esm' },
          { dir: 'dist', moduleFormat: 'cjs' },
        ],
        exclude: ['**/stories/**'],
      }),
    ]
      .flat()
      .map(plugin => ({
        ...plugin,
        apply: (config: UserConfig) => Boolean(config.build?.lib),
      })),
    mode === 'test' &&
      visualizer({
        emitFile: true,
      }),
  ],
  build: {
    cssMinify: 'lightningcss',
    lib: {
      entry: path.resolve(import.meta.dirname, 'src/index.ts'),
      name: 'MV',
      formats: ['es', 'umd'],
      fileName: format => `@sa-mv.${format}.${format === 'umd' ? 'cjs' : 'js'}`,
    },
    rolldownOptions: {
      external: id => Object.keys(peerDependencies).some(name => id === name || id.startsWith(`${name}/`)),
      output: {
        globals: {
          react: 'React',
          'react/jsx-runtime': 'ReactJSXRuntime',
          'react/jsx-dev-runtime': 'ReactJSXDevRuntime',
          'react-dom': 'ReactDOM',
          effector: 'effector',
          'effector-react': 'effectorReact',
          '@sensearena/ui': 'SenseArenaUI',
          '@dnd-kit/core': 'DndKitCore',
          '@dnd-kit/modifiers': 'DndKitModifiers',
          'perfect-arrows': 'perfectArrows',
          '@mui/material': 'MaterialUI',
          '@vanilla-extract/recipes/createRuntimeFn': 'VanillaExtractRecipesRuntime',
        },
      },
    },
  },
}));
