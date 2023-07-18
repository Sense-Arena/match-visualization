import { CourtItem } from '@core/contracts';
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

export const DraggableBall = memo<Props>(({ x, y, basePath }) => {
  const { animated, dargEnabled, banned } = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const { courtStep } = extractCombinedKey(state.courtStepsHistory.at(-1));

      return {
        animated: state.animated,
        dargEnabled: courtStep === 'ball_move',
        banned: state.banned,
      };
    },
  });

  const { listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: CourtItem.Ball,
    disabled: !dargEnabled,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <img
      src={`${basePath}imgs/tennis-courts/ball.svg`}
      alt="tennis ball"
      width="27px"
      height="27px"
      className={clsx(
        stStyles.ddItem,
        stStyles.dragging({ isDragging, disabled: !dargEnabled, banned }),
        stStyles.pulsingAnimation({ pulse: animated && dargEnabled ? 'ball' : undefined }),
      )}
      {...listeners}
      style={{ ...style, top: y, left: x }}
      ref={setNodeRef}
    />
  );
});

DraggableBall.displayName = 'DraggableBall';
