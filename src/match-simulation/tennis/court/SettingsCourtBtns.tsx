import { MSSavePayload, TennisMatchWind } from '@core/contracts';
import { Button, ButtonGroup, DeleteIcon, IconButton, Modal, Paragraph } from '@sensearena/ui';
import { useStoreMap } from 'effector-react';
import { memo, useCallback, useRef, useState } from 'react';
import { extractCombinedKey } from '../calculations/operations';
import { additionalTradeData, maxTennisTrades, predefinedCourtSteps, stepHints } from '../constants';
import { $msSettings, backCourtStep, eraseSubseqTrades, forwardCourtStep, setMSStep } from '../store.ms';
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
  const [opened, setModalOpen] = useState(false);
  const mutatedCourtSteps = useRef({ ...predefinedCourtSteps });
  const { settings, prevStepsLength, trades, canSave, tradeOrder, isLastTradeStep, shouldAddNewTrade, canErase } =
    useStoreMap({
      store: $msSettings,
      keys: [mutatedCourtSteps.current],
      fn: (state, [mCS]) => {
        const { tradeOrder, courtStep } = extractCombinedKey(state.courtStepsHistory.at(-1));

        return {
          settings: state.settings,
          prevStepsLength: state.courtStepsHistory.length,
          trades: state.unityTradesA,
          shouldAddNewTrade: mCS[state.settings.type].length === state.courtStepsHistory.length,
          canSave: predefinedCourtSteps[state.settings.type].length <= state.courtStepsHistory.length,
          canErase: state.unityTradesA.length > 3,
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
    if (shouldAddNewTrade) {
      const newDataToAdd = additionalTradeData.steps.map((v, index) => {
        const ck = extractCombinedKey(v);
        const step = `${ck.courtStep}__trades-${ck.tradeOrder + tradeOrder}` as CombinedTradeKey;
        return {
          step,
          info: additionalTradeData.infos[index],
        };
      });
      mutatedCourtSteps.current[settings.type] = mutatedCourtSteps.current[settings.type].concat(
        newDataToAdd.map(v => v.step),
      );
      stepHints[settings.type] = {
        ...stepHints[settings.type],
        ...newDataToAdd.reduce((acc, next) => {
          acc[next.step] = next.info;
          return acc;
        }, {} as Record<CombinedTradeKey, string>),
      };
    }
    forwardCourtStep(mutatedCourtSteps.current[settings.type].slice(prevStepsLength)[0]);
    document.getElementById(oppSideId)?.scrollIntoView({ behavior: 'smooth' });
  }, [shouldAddNewTrade, settings.type, prevStepsLength, tradeOrder, mutatedCourtSteps]);

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
  }, [settings, id, goBack, editMS, trades, createMS]);

  const onErase = useCallback(() => {
    setModalOpen(true);
  }, []);
  const eraseSteps = useCallback(() => {
    setModalOpen(false);
    eraseSubseqTrades();
    onBack();
  }, [onBack]);
  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <>
      <div className={stStyles.btnsGroup}>
        <ButtonGroup>
          <Button size="s" mode="square" color="secondary" onClick={onBack} disabled={loading}>
            back
          </Button>
          {isLastTradeStep ? null : (
            <Button size="s" mode="square" onClick={onForward} loading={loading}>
              next
            </Button>
          )}
          <Button
            size="s"
            mode="square"
            color="secondary_action"
            onClick={onSave}
            loading={loading}
            style={{ textTransform: 'uppercase' }}
            disabled={!canSave}
          >
            save
          </Button>
        </ButtonGroup>
        <IconButton size="s" color="primary" onClick={onErase} style={{ textTransform: 'uppercase' }} disabled={!canErase}>
          <DeleteIcon />
        </IconButton>
      </div>
      <Modal open={opened} handleClose={closeModal} title="Erase steps" size="s">
        <Paragraph variant="caption">Would you like to erase the current step and all subsequent steps?</Paragraph>

        <ButtonGroup className={stStyles.modalActions}>
          <Button onClick={eraseSteps} size="s" mode="square" color="primary">
            Yes
          </Button>
          <Button size="s" mode="square" color="secondary" onClick={closeModal}>
            No
          </Button>
        </ButtonGroup>
      </Modal>
    </>
  );
});

SettingsCourtBtns.displayName = 'SettingsCourtBtns';
