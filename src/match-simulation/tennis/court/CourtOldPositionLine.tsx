import { themeVars } from '@sensearena/ui';
import { getArrow } from 'perfect-arrows';
import { memo } from 'react';
import { mcs } from '../constants';

type Props = {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  height: number;
  width: number;
};

export const CourtOldPositionLine = memo<Props>(({ height, prevX, prevY, width, x, y }) => {
  const arrow = getArrow(prevX + mcs.TShirtXOffset, prevY + mcs.TShirtYOffset, x + 15, y + 27, {
    padEnd: 25,
    straights: true,
    bow: 0,
    stretch: 0,
  });
  const [sx, sy, cx, cy, ex, ey, ae] = arrow;
  const endAngleAsDegrees = ae * (180 / Math.PI);
  return (
    <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0, opacity: 0.65 }}>
      <circle cx={sx} cy={sy} r={4} opacity={0.65} />
      <path
        d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`}
        stroke={themeVars.colors.text}
        strokeWidth="3"
        strokeDasharray="10, 4"
        opacity={0.55}
        shapeRendering="geometricPrecision"
        fill="none"
      />
      <polygon points="0,-6 12,0, 0,6" transform={`translate(${ex},${ey}) rotate(${endAngleAsDegrees})`} opacity={0.65} />
    </svg>
  );
});
CourtOldPositionLine.displayName = 'CourtOldPositionLine';
