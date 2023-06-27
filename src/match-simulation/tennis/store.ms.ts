import { Coordinates, CourtItem, MatchSimulationSettingsConfig, UnityTrade, UnityTradeData } from '@core/contracts';
import { msD } from './api/domain.ms';
import { calcUnityValues, extractCombinedKey } from './calculations/operations';
import { defaultMSDraft } from './constants';
import { CombinedTradeKey, MSSettingsState, OpponentCfgPayload, PlayerCfgPayload } from './types';

export const saveMSSettings = msD.createEvent<MatchSimulationSettingsConfig>();
export const setMSStep = msD.createEvent<MSSettingsState['step']>();
export const toggleAdvanced = msD.createEvent();
export const setDragItemCoordinates = msD.createEvent<{ item: CourtItem; coordinates: Coordinates }>();
export const saveOpponentConfig = msD.createEvent<OpponentCfgPayload>();
export const savePlayerConfig = msD.createEvent<PlayerCfgPayload>();
export const setImgSize = msD.createEvent<{ width: number; height: number }>();
export const resetMSState = msD.createEvent();
export const resetTrades = msD.createEvent();
export const setAgeCategoryInfo = msD.createEvent<{ title: string }>();
export const forwardCourtStep = msD.createEvent<CombinedTradeKey>();
export const backCourtStep = msD.createEvent();
export const setAnimation = msD.createEvent<boolean>();
export const setBan = msD.createEvent<boolean>();
export const addDefaultTrade = msD.createEvent<UnityTradeData | null>();
export const recalcPositions = msD.createEvent();

export const $msSettings = msD.createStore<MSSettingsState>(defaultMSDraft);

$msSettings.on(saveMSSettings, (state, settings) => ({
  ...state,
  settings: {
    ...settings,
    duration: Number(settings.duration),
  },
}));
$msSettings.on(setMSStep, (state, step) => ({
  ...state,
  step,
}));
$msSettings.on(toggleAdvanced, state => ({
  ...state,
  advancedOpen: !state.advancedOpen,
}));

$msSettings.on(setDragItemCoordinates, (state, payload) => {
  const { tradeOrder } = extractCombinedKey(state.courtStepsHistory.at(-1));

  const newCoords = calcUnityValues({
    item: payload.item,
    height: state.img.height,
    width: state.img.width,
    x: payload.coordinates.x,
    y: payload.coordinates.y,
  });

  return {
    ...state,
    unityTradesA: state.unityTradesA.map(ut => {
      if (ut.order === tradeOrder) {
        return {
          ...ut,
          config: {
            ...ut.config,
            [payload.item]: {
              ...ut.config[payload.item as keyof UnityTrade],
              position: [newCoords.x, 0, newCoords.y],
            },
          },
        };
      }

      return ut;
    }),
    animated: true,
  };
});

$msSettings.on(savePlayerConfig, (state, payload) => {
  const { tradeOrder } = extractCombinedKey(state.courtStepsHistory.at(-1));

  const trade = state.unityTradesA.find(t => t.order === tradeOrder);

  const newState = {
    ...state,
    unityTradesA: state.unityTradesA.map(ut => {
      if (ut.order === tradeOrder) {
        const [min, max] = payload.serve_speed?.split('__') ?? [0, 0];

        return {
          ...ut,
          config: {
            ...ut.config,
            player: {
              ...ut.config.player,
              ...(payload.serve_speed
                ? {
                    ...payload,
                    serve_speed: [Number(min), Number(max)] as UnityTrade['player']['serve_speed'],
                  }
                : (payload as UnityTrade['player'])),
            },
          },
        };
      }

      return ut;
    }),
  };
  return {
    ...newState,
    unityTradesA:
      (payload.strike_zone && trade?.config.player.strike_zone !== payload.strike_zone) ||
      (payload.strike_approach && trade?.config.player.strike_approach !== payload.strike_approach) ||
      (payload.shot_type && trade?.config.player.shot_type !== payload.shot_type)
        ? newState.unityTradesA.filter(ut => ut.order !== tradeOrder + 1)
        : newState.unityTradesA,
  };
});
$msSettings.on(saveOpponentConfig, (state, payload) => {
  const { tradeOrder } = extractCombinedKey(state.courtStepsHistory.at(-1));

  const trade = state.unityTradesA.find(t => t.order === tradeOrder);
  const [min, max] = payload.serve_speed?.split('__') ?? [0, 0];

  const newState = {
    ...state,
    unityTradesA: state.unityTradesA.map(ut => {
      if (ut.order === tradeOrder) {
        return {
          ...ut,
          config: {
            ...ut.config,
            opponent: {
              ...ut.config.opponent,
              ...(payload.serve_speed
                ? {
                    ...payload,
                    serve_speed: [Number(min), Number(max)] as UnityTrade['opponent']['serve_speed'],
                  }
                : (payload as UnityTrade['opponent'])),
            },
          },
        };
      }

      return ut;
    }),
  };

  return {
    ...newState,
    unityTradesA:
      (payload.strike_approach && trade?.config.opponent.strike_approach !== payload.strike_approach) ||
      (payload.shot_type && trade?.config.opponent.shot_type !== payload.shot_type)
        ? newState.unityTradesA.filter(ut => ut.order !== tradeOrder + 1)
        : newState.unityTradesA,
  };
});

$msSettings.on(addDefaultTrade, (state, defaultTrade) => {
  if (!defaultTrade || state.unityTradesA.some(ut => ut.order === defaultTrade.order)) {
    return state;
  }

  return {
    ...state,
    unityTradesA: state.unityTradesA.concat(defaultTrade),
  };
});

$msSettings.on(recalcPositions, state => {
  const { tradeOrder } = extractCombinedKey(state.courtStepsHistory.at(-1));

  return {
    ...state,
    unityTradesA: state.unityTradesA.filter(ut => ut.order !== tradeOrder + 1),
  };
});

$msSettings.on(setImgSize, (state, img) => ({
  ...state,
  img,
}));
$msSettings.on(resetMSState, () => defaultMSDraft);
$msSettings.on(setAgeCategoryInfo, (state, { title }) => ({
  ...state,
  ageCategoryTitle: title,
}));
$msSettings.on(setAnimation, (state, animated) => ({
  ...state,
  animated,
}));
$msSettings.on(setBan, (state, banned) => ({
  ...state,
  banned,
}));
$msSettings.on(forwardCourtStep, (state, combinedKey) => ({
  ...state,
  courtStepsHistory: state.courtStepsHistory.concat(combinedKey),
}));
$msSettings.on(backCourtStep, state => {
  const newArr = state.courtStepsHistory;
  newArr.pop();

  return {
    ...state,
    courtStepsHistory: newArr,
  };
});

$msSettings.on(resetTrades, state => {
  return {
    ...state,
    unityTradesA: [],
  };
});

// $msSettings.on(getMatchSimulationFX.doneData, (_, data) => data);

// forward({
//   from: [createMatchSimulationFX.done, editMatchSimulationFX.done],
//   to: resetMSState,
// });

// forward({
//   from: [deleteMatchSimulationFX.done],
//   to: [hideModal],
// });

// addToToastFactory($uic, {
//   apis: [createMatchSimulationFX, editMatchSimulationFX, deleteMatchSimulationFX],
//   toastId: ToastId.MS,
// });
