import { CourtItem, StartType } from '@core/contracts';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DragEndEvent, DragMoveEvent } from '@dnd-kit/core/dist/types';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { useStoreMap } from 'effector-react';
import { memo, useCallback, useRef } from 'react';
import { $msUI } from '../calc.ms';
import { calcUnityValues, extractCombinedKey } from '../calculations/operations';
import { ballZone } from '../constants';
import { $msSettings, recalcPositions, setAnimation, setBan, setDragItemCoordinates, setImgSize } from '../store.ms';
import { CourtLines } from './CourtLines';
import { CourtLoading } from './CourtLoading';
import { DraggableAI } from './DraggableAI';
import { DraggableBall } from './DraggableBall';
import { DraggableCannon } from './DraggableCannon';
import { DraggablePlayer } from './DraggablePlayer';
import { HintBtn } from './HintBtn';
import { stStyles } from './st.css';
import { useTradesDefault } from './useTradesDefault';

export const ActionableCourt = memo<{
  basePath?: string;
}>(({ basePath }) => {
  const courtRef = useRef<HTMLImageElement>(null);
  const { surface, tradeOrder, isCannonBall, isFirstServe, isFirstReturn } = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const { tradeOrder, courtStep } = extractCombinedKey(state.courtStepsHistory.at(-1));

      return {
        surface: state.settings.surface,
        tradeOrder,
        isCannonBall: courtStep === 'ball_move' && state.settings.type === StartType.Rally && tradeOrder === 1,
        isFirstServe: courtStep === 'ball_move' && tradeOrder === 1 && state.settings.type === StartType.Serve,
        isFirstReturn: courtStep === 'ball_move' && tradeOrder === 1 && state.settings.type === StartType.Return,
      };
    },
  });
  const info = useStoreMap({
    store: $msUI,
    keys: [tradeOrder],
    fn: (state, [tOr]) => {
      return state.find(t => t.tradeOrder === tOr)!;
    },
  });

  useTradesDefault();

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const defineY = useCallback(
    (item: CourtItem, deltaY: number) => {
      const court = courtRef.current!;
      const calcY = info.trade.coords[item].y + deltaY;
      switch (item) {
        case CourtItem.Player:
        case CourtItem.Cannon: {
          const maxPlayerY = court.offsetHeight / 2 - 20;

          return calcY < maxPlayerY ? maxPlayerY : calcY;
        }
        case CourtItem.AI: {
          const maxAIY = court.offsetHeight / 2 - 54;

          return calcY > maxAIY ? maxAIY : calcY;
        }

        case CourtItem.Ball: {
          const newCoords = calcUnityValues({
            item,
            height: court.offsetHeight,
            width: court.offsetWidth,
            x: 0,
            y: calcY,
          });
          const maxBallCoord =
            newCoords.y > (isFirstReturn ? ballZone.retrn.maxY : isFirstServe ? ballZone.serve.maxY : ballZone.maxY) ||
            newCoords.y <
              (isFirstReturn
                ? ballZone.retrn.minY
                : isFirstServe
                ? ballZone.serve.minY
                : isCannonBall
                ? ballZone.cannon.minY
                : ballZone.minY)
              ? info.trade.coords[item].y
              : calcY;
          return maxBallCoord;
        }

        default:
          return calcY;
      }
    },
    [info, courtRef, isCannonBall, isFirstServe, isFirstReturn],
  );
  const defineX = useCallback(
    (item: CourtItem, deltaX: number) => {
      const court = courtRef.current!;
      const calcX = info.trade.coords[item].x + deltaX;
      switch (item) {
        case CourtItem.Ball: {
          const newCoords = calcUnityValues({
            item,
            height: court.offsetHeight,
            width: court.offsetWidth,
            x: calcX,
            y: 0,
          });
          const maxBallCoord =
            newCoords.x > ballZone.maxX || newCoords.x < ballZone.minX ? info.trade.coords[item].x : calcX;

          return maxBallCoord;
        }

        default:
          return calcX;
      }
    },
    [info, courtRef],
  );

  const onDragEnd = useCallback(
    ({ delta, active }: DragEndEvent) => {
      const id = active.id as CourtItem;
      setDragItemCoordinates({
        coordinates: {
          x: defineX(id, delta.x),
          y: defineY(id, delta.y),
        },
        item: id,
      });
      if (id === CourtItem.Ball) {
        recalcPositions();
      }
    },
    [defineY, defineX],
  );
  const onDragMove = useCallback(
    ({ delta, active }: DragMoveEvent) => {
      const item = active.id as CourtItem;
      const court = courtRef.current!;
      switch (item) {
        case CourtItem.Ball: {
          const calcX = info.trade.coords[item].x + delta.x;
          const calcY = info.trade.coords[item].y + delta.y;
          const newCoords = calcUnityValues({
            item,
            height: court.offsetHeight,
            width: court.offsetWidth,
            x: calcX,
            y: calcY,
          });

          setBan(
            newCoords.x > ballZone.maxX ||
              newCoords.x < ballZone.minX ||
              newCoords.y > (isFirstReturn ? ballZone.retrn.maxY : isFirstServe ? ballZone.serve.maxY : ballZone.maxY) ||
              newCoords.y <
                (isFirstReturn
                  ? ballZone.retrn.minY
                  : isFirstServe
                  ? ballZone.serve.minY
                  : isCannonBall
                  ? ballZone.cannon.minY
                  : ballZone.minY),
          );

          break;
        }

        default:
          break;
      }
    },
    [info, courtRef, isCannonBall, isFirstServe, isFirstReturn],
  );

  return (
    <DndContext
      onDragEnd={onDragEnd}
      onDragStart={() => setAnimation(false)}
      sensors={sensors}
      modifiers={[restrictToParentElement]}
      onDragMove={onDragMove}
    >
      <img
        src={`${basePath}imgs/tennis-courts/t_court_${surface}.jpg`}
        alt="tennis court surface"
        className={stStyles.tennisCourt}
        ref={courtRef}
        onLoad={() => {
          setImgSize({
            height: courtRef.current?.offsetHeight ?? 0,
            width: courtRef.current?.offsetWidth ?? 0,
          });
        }}
      />
      <CourtLines
        width={courtRef.current?.offsetWidth ?? 0}
        height={courtRef.current?.offsetHeight ?? 0}
        trade={info.trade}
      />

      <DraggableBall x={info.trade.coords.ball.x} y={info.trade.coords.ball.y} basePath={basePath} />
      <DraggableAI
        x={info.trade.coords.opponent.x}
        y={info.trade.coords.opponent.y}
        width={courtRef.current?.offsetWidth ?? 0}
        height={courtRef.current?.offsetHeight ?? 0}
        basePath={basePath}
      />
      <DraggablePlayer
        x={info.trade.coords.player.x}
        y={info.trade.coords.player.y}
        width={courtRef.current?.offsetWidth ?? 0}
        height={courtRef.current?.offsetHeight ?? 0}
        basePath={basePath}
      />
      <DraggableCannon x={info.trade.coords.cannon.x} y={info.trade.coords.cannon.y} basePath={basePath} />

      <CourtLoading />
      <HintBtn />
    </DndContext>
  );
});

ActionableCourt.displayName = 'ActionableCourt';
