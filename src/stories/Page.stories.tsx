import { StartType } from '@core/contracts';
import { Card, noop } from '@sensearena/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useUnit } from 'effector-react';
import * as React from 'react';
import {
  SettingsCourt,
  $msSettings,
  forwardCourtStep,
  predefinedCourtSteps,
  resetMSState,
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

const Wrap = ({ children, startType }: React.PropsWithChildren<{ startType: StartType }>) => {
  const state = useUnit($msSettings);
  React.useEffect(() => {
    resetMSState();
    saveMSSettings({
      ...settingsDefaultValues,
      type: startType,
    });
    forwardCourtStep(predefinedCourtSteps[startType][0]);
  }, [startType]);

  return (
    <div data-court-step={state.courtStepsHistory.at(-1)}>
      <Card withPadding={false} withDivider={false} className={cardStyles} title="Court">
        {children}
      </Card>
    </div>
  );
};

const renderCourt = (startType: StartType) => (args: React.ComponentProps<typeof SettingsCourt>) => (
  <Wrap startType={startType}>
    <SettingsCourt {...args} />
  </Wrap>
);

export const Base: Story = {
  args: {
    createMS: () => Promise.resolve(),
    editMS: () => Promise.resolve(),
    loading: false,
    goBack: noop,
  },
  render: renderCourt(StartType.Rally),
};

export const Serve: Story = { ...Base, render: renderCourt(StartType.Serve) };
export const Return: Story = { ...Base, render: renderCourt(StartType.Return) };
