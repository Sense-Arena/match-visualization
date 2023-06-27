import { Coordinates, CourtItem } from '@core/contracts';
import { mcs } from '../constants';
import { CombinedTradeKey, CourtStep, TradeKeys } from '../types';
import { UwU } from './init';

export const calcUnityValues = ({
  x,
  y,
  width,
  height,
  item,
}: Coordinates & { item: CourtItem; width: number; height: number }) => {
  switch (item) {
    case CourtItem.Ball:
      return {
        x: UwU.calcX(x + mcs.ballHalfSize, width),
        y: UwU.calcY(y + mcs.ballHalfSize, height),
      };
    case CourtItem.AI:
    case CourtItem.Player:
      return {
        x: UwU.calcX(x + mcs.TShirtXOffset, width),
        y: UwU.calcY(y + mcs.TShirtYOffset, height),
      };
    case CourtItem.Cannon:
      return {
        x: UwU.calcX(x + mcs.CannonXOffset, width),
        y: UwU.calcY(y + mcs.CannonYOffset, height),
      };
  }
};

export const extractCombinedKey = (combinedKey: CombinedTradeKey = 'player_move__trades-1') => {
  const [courtStep, tradeKey] = combinedKey.split('__') as [CourtStep, TradeKeys];
  const [, order] = tradeKey.split('-');

  return {
    courtStep,
    tradeKey,
    tradeOrder: Number(order),
  };
};
