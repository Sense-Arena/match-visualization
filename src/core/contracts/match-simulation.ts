export enum UserGender {
  Male = 'male',
  Female = 'female',
}

export enum UserHand {
  Left = 'left',
  Right = 'right',
}

export enum CourtItem {
  Ball = 'ball',
  AI = 'opponent',
  Player = 'player',
  Cannon = 'cannon',
}

export enum StartType {
  Serve = 'serve',
  Return = 'ret',
  Rally = 'rally',
}
export enum MatchDaytime {
  Morning = 'morning',
  Noon = 'noon',
  Afternoon = 'afternoon',
  Night = 'night',
}
export enum TennisMatchWind {
  None = 'none',
  Light = 'light',
  Medium = 'medium',
  Hard = 'hard',
}
export enum TennisWindDirection {
  North = 'north',
  North_East = 'north_east',
  East = 'east',
  South_East = 'south_east',
  South = 'south',
  South_West = 'south_west',
  West = 'west',
  North_West = 'north_west',
}
export enum TennisMatchSurface {
  Hard = 'hard',
  Clay = 'clay',
  Grass = 'grass',
}

export enum TennisMatchShotType {
  Forehand = 'forehand',
  Backhand = 'backhand',
}
export enum TennisMatchStrikeType {
  Drive = 'drive',
  Slice = 'slice',
}
export enum TennisMatchServeRotation {
  Flat = 'flat',
  Slice = 'slice',
  Kick = 'kick',
}
export enum TennisMatchStrikeZone {
  Comfort = 'comfort',
  Body = 'body',
  FullStretch = 'full_stretch',
}
export enum TennisMatchStrikeApproach {
  Volley = 'volley',
  AfterBounce = 'after_bounce',
}

export type MatchSimulationSettingsConfig = {
  title: string;
  type: StartType;
  gender: UserGender;
  opponent_hand: UserHand;
  duration: number;
  opponent_height: number;
  daytime: MatchDaytime;
  wind: TennisMatchWind | null;
  wind_direction: TennisWindDirection;
  surface: TennisMatchSurface;
  score: string;
  age_category_id: string;
  units: 'mph' | 'kmh';
};

export type UnityTrade = {
  player: {
    position: [x: number, y: 0, z: number];
    serve_speed?: [min: number, max: number];
    serve_number?: 1 | 2;
    shot_type?: TennisMatchShotType;
    strike_zone?: TennisMatchStrikeZone;
    strike_approach?: TennisMatchStrikeApproach;
  };
  ball: {
    position: [x: number, y: 0, z: number];
  };
  cannon?: {
    position: [x: number, y: 0, z: number];
  };
  opponent: {
    position: [x: number, y: 0, z: number];
    shot_type?: TennisMatchShotType;
    strike_type?: TennisMatchStrikeType;
    serve_speed?: [min: number, max: number];
    serve_number?: 1 | 2;
    serve_rotation?: TennisMatchServeRotation;
    strike_approach?: TennisMatchStrikeApproach;
  };
};

export type UnityTradeData = {
  order: number;
  config: UnityTrade;
};

export type CustomDrill = {
  id: string;
  title: string;
  type: StartType;
  gender: UserGender;
  opponent_hand: UserHand;
  duration: number;
  opponent_height: number;
  daytime: MatchDaytime;
  wind: TennisMatchWind | null;
  wind_direction: TennisWindDirection;
  surface: TennisMatchSurface;
  score: string;
  age_category: {
    title: string;
    type: string[];
    id: string;
  };
  trades: UnityTradeData[];
  units: 'mph' | 'kmh';
};

export type MSSavePayload = MatchSimulationSettingsConfig & {
  trades: UnityTradeData[];
};

export type Coordinates = {
  x: number;
  y: number;
};

export type TennisTrade = {
  coords: Record<CourtItem, Coordinates>;
};

export type TennisTradePayload = {
  tradeOrder: number;
  uTrade?: UnityTrade;
  width: number;
  height: number;
};
