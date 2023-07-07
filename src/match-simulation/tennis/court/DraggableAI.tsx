import { CourtItem } from '@core/contracts';
import { useDraggable } from '@dnd-kit/core';
import { clsx } from '@sensearena/ui';
import { useStore, useStoreMap } from 'effector-react';
import { Fragment, memo } from 'react';
import { FormTooltip } from 'src/tootlip/FormTooltip';
import { extractCombinedKey } from '../calculations/operations';
import { $prevTrades } from '../selectors.ms';
import { $msSettings } from '../store.ms';
import { CourtOldPositionLine } from './CourtOldPositionLine';
import { OpponentConfigForm } from './OpponentConfigForm';
import { stStyles } from './st.css';

type Props = {
  x: number;
  y: number;
  height: number;
  width: number;
};

export const DraggableAI = memo<Props>(({ x, y, width, height }) => {
  const { dargEnabled, animated, openConfig, tradeOrder } = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const { courtStep, tradeOrder } = extractCombinedKey(state.courtStepsHistory.at(-1));
      return {
        dargEnabled: courtStep === 'opponent_move',
        animated: state.animated,
        openConfig: courtStep === 'opponent_config',
        tradeOrder,
      };
    },
  });
  const prevTrades = useStore($prevTrades);

  const { listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: CourtItem.AI,
    disabled: !dargEnabled,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <>
      <FormTooltip title={<OpponentConfigForm />} arrow open={openConfig}>
        <img
          src="/imgs/tennis-courts/AI.svg"
          alt="tennis AI"
          width="50px"
          height="54px"
          className={clsx(
            stStyles.ddItem,
            stStyles.dragging({ isDragging, disabled: !dargEnabled }),
            stStyles.pulsingAnimation({ pulse: animated && dargEnabled ? 'ai' : undefined }),
          )}
          {...listeners}
          style={{ ...style, top: y, left: x }}
          ref={setNodeRef}
        />
      </FormTooltip>
      <div className={stStyles.ddItem} style={{ ...style, top: y - 10, left: x + 15 }}>
        {tradeOrder}
      </div>
      {prevTrades.map(pTrade => (
        <Fragment key={pTrade.tradeOrder}>
          {pTrade.trade.coords.opponent.y === y && pTrade.trade.coords.opponent.x === x ? null : (
            <>
              <img
                src="/imgs/tennis-courts/AI.svg"
                alt="tennis AI old"
                width="50px"
                height="54px"
                className={stStyles.oldItem}
                style={{ top: pTrade.trade.coords.opponent.y, left: pTrade.trade.coords.opponent.x }}
              />

              <div
                className={stStyles.oldItem}
                style={{ top: pTrade.trade.coords.opponent.y - 10, left: pTrade.trade.coords.opponent.x + 15 }}
              >
                {pTrade.tradeOrder}
              </div>
              <CourtOldPositionLine
                height={height}
                prevX={pTrade.trade.coords.opponent.x}
                prevY={pTrade.trade.coords.opponent.y}
                width={width}
                x={
                  pTrade.tradeOrder === tradeOrder - 1
                    ? x
                    : prevTrades.find(t => t.tradeOrder === pTrade.tradeOrder + 1)?.trade.coords.opponent.x ?? 0
                }
                y={
                  pTrade.tradeOrder === tradeOrder - 1
                    ? y
                    : prevTrades.find(t => t.tradeOrder === pTrade.tradeOrder + 1)?.trade.coords.opponent.y ?? 0
                }
              />
            </>
          )}
        </Fragment>
      ))}
    </>
  );
});

DraggableAI.displayName = 'DraggableAI';
