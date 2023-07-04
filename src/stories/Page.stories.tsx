import { StartType } from '@core/contracts';
import { Card } from '@sensearena/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { PropsWithChildren, useEffect } from 'react';
import {
  SettingsCourt,
  forwardCourtStep,
  predefinedCourtSteps,
  saveMSSettings,
  settingsDefaultValues,
} from 'src/match-simulation/tennis';
import { cardStyles } from './card.css';

const meta = {
  title: 'MV tennis court',
  component: SettingsCourt,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SettingsCourt>;

export default meta;
type Story = StoryObj<typeof meta>;

const Wrap = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    saveMSSettings({
      ...settingsDefaultValues,
      type: StartType.Rally,
    });
    forwardCourtStep(predefinedCourtSteps['serve'][0]);
  }, []);

  return (
    <Card withPadding={false} withDivider={false} className={cardStyles} title="Court">
      {children}
    </Card>
  );
};

export const Base: Story = {
  args: {
    createMS: () => Promise.resolve(),
    editMS: () => Promise.resolve(),
    loading: false,
    goBack: () => {},
  },
  render: args => (
    <Wrap>
      <SettingsCourt {...args} />
    </Wrap>
  ),
};
