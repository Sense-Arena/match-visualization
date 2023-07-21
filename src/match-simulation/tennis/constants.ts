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

export const settingsDefaultValues: MatchSimulationSettingsConfig = {
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
    maxY: 7,
    minY: 4,
  },
  retrn: {
    maxY: -4,
    minY: -7,
  },
};

export const TShirtZone = {
  opponentY: 12,
  playerY: -12,
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

export const additionalTradeData: {
  steps: CombinedTradeKey[];
  infos: string[];
} = {
  steps: [
    'opponent_config__trades-0',
    'player_move__trades-1',
    'ball_move__trades-1',
    'player_config__trades-1',
    'opponent_move__trades-2',
    'ball_move__trades-2',
  ],
  infos: [
    'Set up how your opponent reacts to your return',
    'Set up where I move after the return',
    'Set up where your opponent places the shot',
    'Now set your reaction up',
    'Set up where your opponent goes after his return',
    'Place the ball where I should place my shot',
  ],
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

export const stepHints: Record<StartType, Record<CombinedTradeKey, string>> = {
  serve: {
    'player_move__trades-1': 'Place your jersey to the serve position',
    'player_config__trades-1': 'Set up your Serve number and Serve speed',
    'ball_move__trades-1': 'Place the ball in the serving square on your opponent’s side',
    'opponent_move__trades-1': 'Set up your opponent’s return position by dragging the blue jersey',
    'opponent_config__trades-1': 'Set up your opponent’s Shot type, Strike type and Situation type',
    'player_move__trades-2': 'Now set up where I go after my serve',
    'ball_move__trades-2': 'Set up the placement of the opponent’s return',
    'player_config__trades-2': 'Now set your reaction up',
    'opponent_move__trades-3': 'Set up where your opponent goes after his return',
    'ball_move__trades-3': 'Place the ball where I should place my shot',
  },
  ret: {
    'opponent_move__trades-1': 'Choose your opponent’s serve position',
    'opponent_config__trades-1': 'Set your opponent’s serve up',
    'ball_move__trades-1': 'Set up your opponent’s serve ball placement',
    'player_move__trades-1': 'Drag the yellow jersey to the position where you want to receive the serve',
    'player_config__trades-1': 'Set up how you want to react to the serve',
    'opponent_move__trades-2': 'Set up where your opponent moves after serve',
    'ball_move__trades-2': 'Place the ball where I want to return',
    'opponent_config__trades-2': 'Set up how your opponent reacts to your return',
    'player_move__trades-3': 'Set up where I move after the return',
    'ball_move__trades-3': 'Set up where your opponent places the shot',
    'player_config__trades-3': 'Set up your reaction',
    'opponent_move__trades-4': 'Set up the spot where your opponent moves',
    'ball_move__trades-4': 'Place your shot by dragging the ball in the position',
  },
  rally: {
    'player_move__trades-1': 'Set up my starting position',
    'opponent_move__trades-1': 'Set up your opponent’s starting position',
    'cannon_move__trades-1': 'Set up cannon’s position. Don’t worry, it will go away after first shot',
    'ball_move__trades-1': 'Set up my shot placement',
    'opponent_config__trades-1': 'Set up your shot',
    'ball_move__trades-2': 'Set up your opponent’s ball placement',
    'player_config__trades-2': 'Set up your shot through the options',
    'opponent_move__trades-3': 'Set up where your opponent goes after the shot',
    'ball_move__trades-3': 'Set up my shot placement',
  },
};

export const opponentHeightOps = [
  {
    title: '6′11″ (210cm)',
    value: 210,
  },
  {
    title: '6′7″ (200cm)',
    value: 200,
  },
  {
    title: '6′3″ (190cm)',
    value: 190,
  },
  {
    title: '5′11″ (180cm)',
    value: 180,
  },
  {
    title: '5′7″ (170cm)',
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

export const maxTennisTrades = 20;
