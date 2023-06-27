import { StartType, TennisTrade } from '@core/contracts';
import { useStoreMap } from 'effector-react';
import { getArrow } from 'perfect-arrows';
import { memo, useMemo } from 'react';
import { extractCombinedKey } from '../calculations/operations';
import { mcs } from '../constants';
import { $msSettings } from '../store.ms';

type Props = {
  height: number;
  width: number;
  trade: TennisTrade;
};

export const CourtLines = memo<Props>(({ width, height, trade }) => {
  const { tradeOrder, startType } = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const { tradeOrder } = extractCombinedKey(state.courtStepsHistory.at(-1));

      return {
        tradeOrder,
        startType: state.settings.type,
      };
    },
  });
  const { coords } = trade;

  const lines = useMemo(() => {
    switch (startType) {
      case StartType.Rally:
      case StartType.Serve:
        switch (tradeOrder) {
          case 1: {
            if (startType === StartType.Serve) {
              return {
                x1: coords.player.x + mcs.TShirtXOffset,
                y1: coords.player.y + mcs.TShirtYOffset,
                x2: coords.ball.x + mcs.ballHalfSize,
                y2: coords.ball.y + mcs.ballSize,
              };
            }

            return {
              x1: coords.cannon.x + mcs.CannonXOffset,
              y1: coords.cannon.y + mcs.CannonYOffset,
              x2: coords.ball.x + mcs.ballHalfSize,
              y2: coords.ball.y + mcs.ballSize,
            };
          }

          case 2:
            return {
              x1: coords.opponent.x + mcs.TShirtXOffset,
              y1: coords.opponent.y + mcs.TShirtYOffset,
              x2: coords.ball.x + mcs.ballHalfSize,
              y2: coords.ball.y,
            };

          case 3:
            return {
              x1: coords.player.x + mcs.TShirtXOffset,
              y1: coords.player.y + mcs.TShirtYOffset,
              x2: coords.ball.x + mcs.ballHalfSize,
              y2: coords.ball.y + mcs.ballSize,
            };

          default:
            return null;
        }
      case StartType.Return:
        switch (tradeOrder) {
          case 1:
          case 3:
            return {
              x1: coords.opponent.x + mcs.TShirtXOffset,
              y1: coords.opponent.y + mcs.TShirtYOffset,
              x2: coords.ball.x + mcs.ballHalfSize,
              y2: coords.ball.y,
            };

          case 2:
          case 4:
            return {
              x1: coords.player.x + mcs.TShirtXOffset,
              y1: coords.player.y + mcs.TShirtYOffset,
              x2: coords.ball.x + mcs.ballHalfSize,
              y2: coords.ball.y + mcs.ballSize,
            };

          default:
            return null;
        }

      default:
        return null;
    }
  }, [coords, tradeOrder, startType]);

  const arrow = getArrow(lines?.x1 ?? 0, lines?.y1 ?? 0, lines?.x2 ?? 0, lines?.y2 ?? 0, {
    padEnd: 10,
    straights: true,
    bow: 0,
    stretch: 0,
  });
  const [sx, sy, cx, cy, ex, ey, ae] = arrow;
  const endAngleAsDegrees = ae * (180 / Math.PI);

  if (!lines) return null;

  return (
    <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
      <circle cx={sx} cy={sy} r={4} />
      <path
        d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`}
        stroke="#DBE33A"
        strokeWidth="3"
        strokeDasharray="10, 4"
        shapeRendering="geometricPrecision"
        fill="none"
        opacity={0.7}
      />
      <polygon points="0,-6 12,0, 0,6" transform={`translate(${ex},${ey}) rotate(${endAngleAsDegrees})`} fill="#DBE33A" />
    </svg>
  );
});

CourtLines.displayName = 'CourtLines';
