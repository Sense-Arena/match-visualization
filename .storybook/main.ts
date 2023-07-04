import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: [{ from: '../imgs', to: '/imgs' }],
  async viteFinal(config) {
    console.debug(config.mode);
    return mergeConfig(config, {
      base: config.mode === 'production' ? '/match-visualization/' : '/',
    });
  },
};
export default config;
