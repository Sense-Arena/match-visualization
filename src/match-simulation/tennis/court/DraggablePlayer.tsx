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
import { PlayerConfigForm } from './PlayerConfigForm';
import { stStyles } from './st.css';

type Props = {
  x: number;
  y: number;
  height: number;
  width: number;
};

export const DraggablePlayer = memo<Props>(({ x, y, width, height }) => {
  const { dargEnabled, animated, openConfig, tradeOrder } = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const { courtStep, tradeOrder } = extractCombinedKey(state.courtStepsHistory.at(-1));

      return {
        dargEnabled: courtStep === 'player_move',
        animated: state.animated,
        openConfig: courtStep === 'player_config',
        tradeOrder,
      };
    },
  });
  const prevTrades = useStore($prevTrades);

  const { listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: CourtItem.Player,
    disabled: !dargEnabled,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  return (
    <>
      <FormTooltip title={<PlayerConfigForm />} arrow open={openConfig} placement="top">
        <img
          src={`/imgs/tennis-courts/player.svg`}
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
      </FormTooltip>
      <div className={stStyles.ddItem} style={{ ...style, top: y - 10, left: x + 15 }}>
        {tradeOrder}
      </div>
      {prevTrades.map(pTrade => (
        <Fragment key={pTrade.tradeOrder}>
          {pTrade.trade.coords.player.y === y && pTrade.trade.coords.player.x === x ? null : (
            <>
              <img
                src="/imgs/tennis-courts/player.svg"
                alt="tennis player old"
                width="50px"
                height="54px"
                className={stStyles.oldItem}
                style={{ top: pTrade.trade.coords.player.y, left: pTrade.trade.coords.player.x }}
              />

              <div
                className={stStyles.oldItem}
                style={{ top: pTrade.trade.coords.player.y - 10, left: pTrade.trade.coords.player.x + 15, opacity: 1 }}
              >
                {pTrade.tradeOrder}
              </div>

              <CourtOldPositionLine
                height={height}
                prevX={pTrade.trade.coords.player.x}
                prevY={pTrade.trade.coords.player.y}
                width={width}
                x={
                  pTrade.tradeOrder === tradeOrder - 1
                    ? x
                    : prevTrades.find(t => t.tradeOrder === pTrade.tradeOrder + 1)?.trade.coords.player.x ?? 0
                }
                y={
                  pTrade.tradeOrder === tradeOrder - 1
                    ? y
                    : prevTrades.find(t => t.tradeOrder === pTrade.tradeOrder + 1)?.trade.coords.player.y ?? 0
                }
              />
            </>
          )}
        </Fragment>
      ))}
    </>
  );
});

DraggablePlayer.displayName = 'DraggablePlayer';
