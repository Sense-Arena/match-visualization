import { TennisTrade, TennisTradePayload } from '@core/contracts';
import { attach, combine, forward } from 'effector';
import { msD } from './api/domain.ms';
import { extractCombinedKey } from './calculations/operations';
import { calcDefaultItemsPositions, convertUnityTradeToState } from './calculations/worker';
import { $msSettings, addDefaultTrade, setDragItemCoordinates } from './store.ms';
import { CalcDefaultValuesPayload } from './types';

export const defaultTrade: TennisTrade = {
  coords: {
    ball: {
      x: 0,
      y: 0,
    },
    opponent: {
      x: 0,
      y: 0,
    },
    player: {
      x: 0,
      y: 0,
    },
    cannon: {
      x: 0,
      y: 0,
    },
  },
};

export const $msUI = msD.createStore<{ trade: TennisTrade; tradeOrder: number }[]>([
  {
    trade: defaultTrade,
    tradeOrder: 1,
  },
  {
    trade: defaultTrade,
    tradeOrder: 2,
  },
  {
    trade: defaultTrade,
    tradeOrder: 3,
  },
  {
    trade: defaultTrade,
    tradeOrder: 4,
  },
]);

const calcUnityValuesAttach = msD.createEffect(async (payload: TennisTradePayload) => {
  const trade = convertUnityTradeToState(payload);
  return { trade, tradeOrder: payload.tradeOrder };
});

const calcDefaultPositionsAttach = msD.createEffect(async (payload: CalcDefaultValuesPayload) => {
  const trade = calcDefaultItemsPositions(payload);
  return trade;
});

export const calcMSUIValues = attach({
  effect: calcUnityValuesAttach,
  source: $msSettings,
  mapParams: (_: void, ms) => {
    const { tradeOrder } = extractCombinedKey(ms.courtStepsHistory.at(-1));

    return {
      height: ms.img.height,
      tradeOrder,
      width: ms.img.width,
      uTrade: ms.unityTradesA.find(t => t.order === tradeOrder)?.config,
    };
  },
});

export const calcDefaultPositions = attach({
  effect: calcDefaultPositionsAttach,
  source: $msSettings,
  mapParams: (_: void, ms) => {
    const { tradeOrder } = extractCombinedKey(ms.courtStepsHistory.at(-1));

    return {
      startType: ms.settings.type,
      tradeOrder,
      trades: ms.unityTradesA,
    };
  },
});

$msUI.on(calcMSUIValues.doneData, (state, data) =>
  state.some(t => t.tradeOrder === data.tradeOrder)
    ? state.filter(t => t.tradeOrder !== data.tradeOrder).concat(data)
    : state.concat(data),
);

export const calcsLoading = combine([calcMSUIValues.pending, calcDefaultPositions.pending], ([a, b]) => a || b);

forward({
  from: [addDefaultTrade, setDragItemCoordinates],
  to: calcMSUIValues,
});

forward({
  from: [calcDefaultPositions.doneData],
  to: addDefaultTrade,
});
