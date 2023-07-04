import { IconButton, InfoIcon } from '@sensearena/ui';
import { useStoreMap } from 'effector-react';
import { useState } from 'react';
import { FormTooltip } from 'src/tootlip/FormTooltip';
import { stepHints } from '../constants';
import { $msSettings } from '../store.ms';
import { stStyles } from './st.css';

export const HintBtn = () => {
  const [open, setOpen] = useState(false);

  const stepHint = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const lastStep = state.courtStepsHistory.at(-1) ?? 'player_move__trades-0';
      return stepHints[state.settings.type][lastStep];
    },
  });

  return (
    <div className={stStyles.hint}>
      <FormTooltip title={stepHint} arrow open={open} placement="top">
        <IconButton onClick={() => setOpen(v => !v)} size="s" color="secondary">
          <InfoIcon />
        </IconButton>
      </FormTooltip>
    </div>
  );
};
