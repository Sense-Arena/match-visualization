import {
  Coordinates,
  CourtItem,
  MatchSimulationSettingsConfig,
  StartType,
  TennisMatchServeRotation,
  TennisMatchShotType,
  TennisMatchSituationType,
  TennisMatchStrikeApproach,
  TennisMatchStrikeType,
  TennisMatchStrikeZone,
  UnityTradeData,
} from '@core/contracts';

export type TradeKeys = `trades-${number}`;
export type CourtStep = 'player_config' | 'player_move' | 'ball_move' | 'cannon_move' | 'opponent_move' | 'opponent_config';

export type CombinedTradeKey = `${CourtStep}__${TradeKeys}`;

export type MSSettingsState = {
  settings: MatchSimulationSettingsConfig;
  step: 'settings' | 'trades';
  courtStepsHistory: CombinedTradeKey[];
  advancedOpen: boolean;
  unityTradesA: UnityTradeData[];
  ageCategoryTitle: string;
  animated: boolean;
  banned: boolean;
  img: {
    width: number;
    height: number;
  };
};

export type CalcUnityValuesPayload = {
  width: number;
  height: number;
  tradeKey: TradeKeys;
  trade: Record<CourtItem, Coordinates>;
};

export type OpponentCfgPayload = {
  shot_type?: TennisMatchShotType;
  strike_type?: TennisMatchStrikeType;
  situation_type?: TennisMatchSituationType;
  serve_speed?: `${number}__${number}`;
  serve_number?: 1 | 2;
  serve_rotation?: TennisMatchServeRotation;
  strike_approach?: TennisMatchStrikeApproach;
};
export type PlayerCfgPayload = {
  serve_speed?: `${number}__${number}`;
  serve_number?: 1 | 2;
  shot_type?: TennisMatchShotType;
  strike_zone?: TennisMatchStrikeZone;
  strike_approach?: TennisMatchStrikeApproach;
};

export type GetMSsPayload = {
  page: number;
  rows: number;
  search?: string;
  filters: Record<string, string>;
};

export type CalcDefaultValuesPayload = {
  tradeOrder: number;
  trades: UnityTradeData[];
  startType: StartType;
};
