import { MSSavePayload, TennisMatchWind } from '@core/contracts';
import { Button, Stack, StackItem, useMQuery } from '@sensearena/ui';
import { useStoreMap } from 'effector-react';
import { memo, useCallback } from 'react';
import { predefinedCourtSteps } from '../constants';
import { $msSettings, backCourtStep, forwardCourtStep, setMSStep } from '../store.ms';
import { oppSideId } from './constants';

export type SettingsCourtBtnsProps = {
  id?: string;
  goBack: () => void;
  loading: boolean;
  createMS: (payload: MSSavePayload) => Promise<void>;
  editMS: (payload: MSSavePayload & { id: string }) => Promise<void>;
};

export const SettingsCourtBtns = memo<SettingsCourtBtnsProps>(({ goBack, loading, id, createMS, editMS }) => {
  const lessThan370px = useMQuery('screen and (max-width: 370px)');
  const { settings, prevStepsLength, trades } = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => ({
      settings: state.settings,
      prevStepsLength: state.courtStepsHistory.length,
      trades: state.unityTradesA,
    }),
  });

  const onBack = useCallback(() => {
    if (prevStepsLength === 1) {
      backCourtStep();
      setMSStep('settings');
    } else {
      backCourtStep();
      document.getElementById(oppSideId)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [prevStepsLength]);

  const onForward = useCallback(async () => {
    if (predefinedCourtSteps[settings.type].length === prevStepsLength) {
      if (id) {
        await editMS({
          ...settings,
          wind: settings.wind === TennisMatchWind.None ? null : settings.wind,
          trades,
          id,
        });
      } else {
        await createMS({
          ...settings,
          wind: settings.wind === TennisMatchWind.None ? null : settings.wind,
          trades,
        });
      }
      goBack();

      return;
    }
    forwardCourtStep(predefinedCourtSteps[settings.type].slice(prevStepsLength)[0]);
    document.getElementById(oppSideId)?.scrollIntoView({ behavior: 'smooth' });
  }, [settings, prevStepsLength, id, goBack, editMS, trades, createMS]);

  return (
    <Stack direction={lessThan370px ? 'column' : 'row'} alignItems="center" justifyContent="center">
      <StackItem direction={lessThan370px ? 'column' : 'row'} spacing={1}>
        <Button mode="square" color="secondary" onClick={onBack} disabled={loading}>
          back
        </Button>
      </StackItem>
      <StackItem direction={lessThan370px ? 'column' : 'row'} spacing={1}>
        <Button mode="square" onClick={onForward} loading={loading}>
          {predefinedCourtSteps[settings.type].length === prevStepsLength ? 'save' : 'next'}
        </Button>
      </StackItem>
    </Stack>
  );
});

SettingsCourtBtns.displayName = 'SettingsCourtBtns';
