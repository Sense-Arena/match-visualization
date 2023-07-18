import { CourtItem, StartType } from '@core/contracts';
import { useDraggable } from '@dnd-kit/core';
import { clsx } from '@sensearena/ui';
import { useStoreMap } from 'effector-react';
import { memo } from 'react';
import { extractCombinedKey } from '../calculations/operations';
import { $msSettings } from '../store.ms';
import { stStyles } from './st.css';

type Props = {
  x: number;
  y: number;
  basePath?: string;
};

export const DraggableCannon = memo<Props>(({ x, y, basePath }) => {
  const { dargEnabled, animated, isCannon } = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const { courtStep, tradeOrder } = extractCombinedKey(state.courtStepsHistory.at(-1));

      return {
        dargEnabled: courtStep === 'cannon_move',
        animated: state.animated,
        isCannon: tradeOrder === 1 && state.settings.type === StartType.Rally,
      };
    },
  });

  const { listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: CourtItem.Cannon,
    disabled: !dargEnabled,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  if (!isCannon) return null;
  return (
    <img
      src={`${basePath}imgs/tennis-courts/cannon.svg`}
      alt="tennis player"
      width="50px"
      height="54px"
      className={clsx(
        stStyles.ddItem,
        stStyles.dragging({ isDragging, disabled: !dargEnabled }),
        stStyles.pulsingAnimation({ pulse: animated && dargEnabled ? 'player' : undefined }),
      )}
      {...listeners}
      style={{ ...style, top: y, left: x }}
      ref={setNodeRef}
    />
  );
});

DraggableCannon.displayName = 'DraggableCannon';
