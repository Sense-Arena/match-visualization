import { MSSavePayload, TennisMatchWind } from '@core/contracts';
import { Button, ButtonGroup } from '@sensearena/ui';
import { useStoreMap } from 'effector-react';
import { memo, useCallback } from 'react';
import { extractCombinedKey } from '../calculations/operations';
import { additionalTradeData, maxTennisTrades, predefinedCourtSteps, stepHints } from '../constants';
import { $msSettings, backCourtStep, forwardCourtStep, setMSStep } from '../store.ms';
import { CombinedTradeKey } from '../types';
import { oppSideId } from './constants';
import { stStyles } from './st.css';

export type SettingsCourtBtnsProps = {
  id?: string;
  goBack: () => void;
  loading: boolean;
  createMS: (payload: MSSavePayload) => Promise<void>;
  editMS: (payload: MSSavePayload & { id: string }) => Promise<void>;
};

export const SettingsCourtBtns = memo<SettingsCourtBtnsProps>(({ goBack, loading, id, createMS, editMS }) => {
  const { settings, prevStepsLength, trades, canSave, tradeOrder, isLastTradeStep } = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const { tradeOrder, courtStep } = extractCombinedKey(state.courtStepsHistory.at(-1));

      return {
        settings: state.settings,
        prevStepsLength: state.courtStepsHistory.length,
        trades: state.unityTradesA,
        canSave: predefinedCourtSteps[state.settings.type].length === state.courtStepsHistory.length,
        tradeOrder,
        isLastTradeStep: tradeOrder === maxTennisTrades + 1 && courtStep === 'ball_move',
      };
    },
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
    if (canSave) {
      const newDataToAdd = additionalTradeData.steps.map((v, index) => {
        const ck = extractCombinedKey(v);
        const step = `${ck.courtStep}__trades-${ck.tradeOrder + tradeOrder}` as CombinedTradeKey;
        return {
          step,
          info: additionalTradeData.infos[index],
        };
      });
      predefinedCourtSteps[settings.type] = predefinedCourtSteps[settings.type].concat(newDataToAdd.map(v => v.step));
      stepHints[settings.type] = {
        ...stepHints[settings.type],
        ...newDataToAdd.reduce((acc, next) => {
          acc[next.step] = next.info;
          return acc;
        }, {} as Record<CombinedTradeKey, string>),
      };
    }
    forwardCourtStep(predefinedCourtSteps[settings.type].slice(prevStepsLength)[0]);
    document.getElementById(oppSideId)?.scrollIntoView({ behavior: 'smooth' });
  }, [canSave, settings.type, prevStepsLength, tradeOrder]);

  const onSave = useCallback(async () => {
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
  }, [settings, id, goBack, editMS, trades, createMS]);

  return (
    <ButtonGroup className={stStyles.btnsGroup}>
      <Button size="s" mode="square" color="secondary" onClick={onBack} disabled={loading}>
        back
      </Button>
      {canSave ? (
        <Button
          size="s"
          mode="square"
          color="secondary_action"
          onClick={onSave}
          loading={loading}
          style={{ textTransform: 'uppercase' }}
        >
          save
        </Button>
      ) : null}
      {isLastTradeStep ? null : (
        <Button size="s" mode="square" onClick={onForward} loading={loading}>
          next
        </Button>
      )}
    </ButtonGroup>
  );
});

SettingsCourtBtns.displayName = 'SettingsCourtBtns';
