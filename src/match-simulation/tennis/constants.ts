import {
  MatchDaytime,
  MatchSimulationSettingsConfig,
  StartType,
  TennisMatchSurface,
  TennisMatchWind,
  TennisWindDirection,
  UserGender,
  UserHand,
} from '@core/contracts';
import { CombinedTradeKey, MSSettingsState } from './types';

const settingsDefaultValues: MatchSimulationSettingsConfig = {
  title: '',
  daytime: MatchDaytime.Noon,
  duration: 10,
  gender: UserGender.Male,
  opponent_hand: UserHand.Left,
  opponent_height: 190,
  score: '0:0',
  type: StartType.Serve,
  surface: TennisMatchSurface.Hard,
  wind: TennisMatchWind.None,
  age_category_id: '',
  wind_direction: TennisWindDirection.North,
  units: 'mph',
  source: 'user',
};

export const mcs = {
  ballHalfSize: 13.5,
  ballSize: 27,
  TShirtYOffset: 47,
  TShirtXOffset: 19,
  CannonYOffset: 51,
  CannonXOffset: 25,
};

export const ballZone = {
  maxX: 4,
  minX: -4,
  maxY: 11.8,
  minY: -11.8,
  cannon: {
    minY: 1,
  },
  serve: {
    maxY: 6.3,
    minY: 4.5,
  },
  retrn: {
    maxY: -4.5,
    minY: -6.3,
  },
};

export const defaultMSDraft: MSSettingsState = {
  settings: settingsDefaultValues,
  step: 'settings',
  advancedOpen: false,
  courtStepsHistory: [],
  animated: true,
  unityTradesA: [],
  img: {
    height: 0,
    width: 0,
  },
  ageCategoryTitle: '',
  banned: false,
};

export const predefinedCourtSteps: Record<StartType, CombinedTradeKey[]> = {
  serve: [
    'player_move__trades-1',
    'player_config__trades-1',
    'ball_move__trades-1',
    'opponent_move__trades-1',
    'opponent_config__trades-1',
    'player_move__trades-2',
    'ball_move__trades-2',
    'player_config__trades-2',
    'opponent_move__trades-3',
    'ball_move__trades-3',
  ],
  ret: [
    'opponent_move__trades-1',
    'opponent_config__trades-1',
    'ball_move__trades-1',
    'player_move__trades-1',
    'player_config__trades-1',
    'opponent_move__trades-2',
    'ball_move__trades-2',
    'opponent_config__trades-2',
    'player_move__trades-3',
    'ball_move__trades-3',
    'player_config__trades-3',
    'opponent_move__trades-4',
    'ball_move__trades-4',
  ],
  rally: [
    'player_move__trades-1',
    'opponent_move__trades-1',
    'cannon_move__trades-1',
    'ball_move__trades-1',
    'opponent_config__trades-1',
    'ball_move__trades-2',
    'player_config__trades-2',
    'opponent_move__trades-3',
    'ball_move__trades-3',
  ],
};

export const opponentHeightOps = [
  {
    title: '6′9″ (210cm)',
    value: 210,
  },
  {
    title: '6′6″ (200cm)',
    value: 200,
  },
  {
    title: '6′3″ (190cm)',
    value: 190,
  },
  {
    title: '5′9″ (180cm)',
    value: 180,
  },
  {
    title: '5′6″ (170cm)',
    value: 170,
  },
];

export const scoreOps = [
  {
    title: '0 : 0',
    value: '0:0',
  },
  {
    title: '0 : 15',
    value: '0:15',
  },
  {
    title: '0 : 30',
    value: '0:30',
  },
  {
    title: '0 : 40',
    value: '0:40',
  },
  {
    title: '15 : 0',
    value: '15:0',
  },
  {
    title: '30 : 0',
    value: '30:0',
  },
  {
    title: '40 : 0',
    value: '40:0',
  },
  {
    title: '15 : 15',
    value: '15:15',
  },
  {
    title: '15 : 30',
    value: '15:30',
  },
  {
    title: '15 : 40',
    value: '15:40',
  },
  {
    title: '30 : 15',
    value: '30:15',
  },
  {
    title: '40 : 15',
    value: '40:15',
  },
  {
    title: '30 : 30',
    value: '30:30',
  },
  {
    title: '30 : 40',
    value: '30:40',
  },
  {
    title: '40 : 30',
    value: '40:30',
  },
  {
    title: '40 : 40',
    value: '40:40',
  },
  {
    title: '40 : AD',
    value: '40:AD',
  },
  {
    title: 'AD : 40',
    value: 'AD:40',
  },
];

export const durationOps = [
  {
    title: '10 Balls',
    value: 10,
  },
  {
    title: '20 Balls',
    value: 20,
  },
  {
    title: '30 Balls',
    value: 30,
  },
];
export const unitsOps: { title: string; value: MatchSimulationSettingsConfig['units'] }[] = [
  {
    title: 'Mph',
    value: 'mph',
  },
  {
    title: 'Kph',
    value: 'kmh',
  },
];
