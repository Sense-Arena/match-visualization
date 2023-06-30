import type { Meta, StoryObj } from '@storybook/react';
import { SettingsCourt } from 'src/match-simulation/tennis';

const meta = {
  title: 'MV tennis court',
  component: SettingsCourt,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SettingsCourt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    createMS: () => Promise.resolve(),
    editMS: () => Promise.resolve(),
    loading: false,
    goBack: () => {},
  },
};
