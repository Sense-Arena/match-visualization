import { IconButton, InfoIcon, themeVars, useClickOutside, useEventListener } from '@sensearena/ui';
import { useStoreMap } from 'effector-react';
import { RefObject, memo, useCallback, useRef, useState } from 'react';
import { FormTooltip } from 'src/tootlip/FormTooltip';
import { stepHints } from '../constants';
import { $msSettings } from '../store.ms';
import { stStyles } from './st.css';

export const HintBtn = memo<{ courtAreaRef: RefObject<HTMLDivElement> }>(({ courtAreaRef }) => {
  const [open, setOpen] = useState(false);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useEventListener('keyup', close, 'Escape');
  useClickOutside(tooltipRef, close, btnRef);

  const stepHint = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const lastStep = state.courtStepsHistory.at(-1) ?? 'player_move__trades-0';
      return stepHints[state.settings.type][lastStep];
    },
  });

  return (
    <div className={stStyles.hint} ref={tooltipRef}>
      <FormTooltip
        title={stepHint}
        arrow
        open={open}
        placement="top"
        PopperProps={{
          popperOptions: {
            modifiers: [
              {
                name: 'preventOverflow',
                options: {
                  boundary: courtAreaRef.current,
                },
              },
            ],
          },
        }}
      >
        <IconButton ref={btnRef} onClick={() => setOpen(v => !v)} size="s" color="secondary">
          <InfoIcon color={themeVars.colors.white} />
        </IconButton>
      </FormTooltip>
    </div>
  );
});
