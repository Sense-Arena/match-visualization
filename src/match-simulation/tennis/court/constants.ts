import {
  MatchSimulationSettingsConfig,
  TennisMatchServeRotation,
  TennisMatchShotType,
  TennisMatchStrikeApproach,
  TennisMatchStrikeType,
  TennisMatchStrikeZone,
  UserGender,
} from '@core/contracts';
import { objKeys } from '@core/utils/mapping';
import { KPHtoMPH } from '@core/utils/range';
import { PlayerCfgPayload } from '../types';

const ageCategoriesTitle = {
  Beginner: 'Beginner',
  Intermediate: 'Intermediate',
  Advanced: 'Advanced',
  Pro: 'Pro',
};

export const serveOps: { title: string; value: PlayerCfgPayload['serve_number'] }[] = [
  {
    title: '1st Serve',
    value: 1,
  },
  {
    title: '2nd Serve',
    value: 2,
  },
];
export const strikeAppOps: { title: string; value: PlayerCfgPayload['strike_approach'] }[] = [
  {
    title: 'After bounce',
    value: TennisMatchStrikeApproach.AfterBounce,
  },
  {
    title: 'Volley',
    value: TennisMatchStrikeApproach.Volley,
  },
];
export const strikeZoneOps: { title: string; value: PlayerCfgPayload['strike_zone'] }[] = [
  {
    title: 'Body',
    value: TennisMatchStrikeZone.Body,
  },
  {
    title: 'Comfort',
    value: TennisMatchStrikeZone.Comfort,
  },
  {
    title: 'Full stretch',
    value: TennisMatchStrikeZone.FullStretch,
  },
];

export const shotTypeOps = objKeys(TennisMatchShotType).map(key => ({ title: key, value: TennisMatchShotType[key] }));
export const strikeTypeOps = objKeys(TennisMatchStrikeType).map(key => ({ title: key, value: TennisMatchStrikeType[key] }));
export const serveRotationOps = objKeys(TennisMatchServeRotation).map(key => ({
  title: key,
  value: TennisMatchServeRotation[key],
}));

const generateSpeedValuesFromRange = (
  startNumber: number,
  units: MatchSimulationSettingsConfig['units'],
  maxIterations = 4,
  diff = 10,
) => {
  const newValues: { title: string; value: `${number}__${number}` }[] = [];
  for (let index = 0; index < maxIterations; index++) {
    const min = startNumber + diff * index;
    const max = min + diff;
    newValues.push({
      title: units === 'mph' ? `${KPHtoMPH(min)}-${KPHtoMPH(max)} mph` : `${min}-${max} km/h`,
      value: `${min}__${max}`,
    });
  }

  return newValues;
};

export const serveSpeedOps = ({
  gender,
  sn,
  units,
  ageCategoryTitle,
}: {
  gender: UserGender;
  sn: PlayerCfgPayload['serve_number'];
  units: MatchSimulationSettingsConfig['units'];
  ageCategoryTitle: string;
}) => {
  switch (gender) {
    case UserGender.Female:
      switch (ageCategoryTitle) {
        case ageCategoriesTitle.Beginner:
        case ageCategoriesTitle.Intermediate:
          return generateSpeedValuesFromRange(sn === 1 ? 110 : 80, units);
        default:
          return generateSpeedValuesFromRange(sn === 1 ? 160 : 130, units);
      }

    case UserGender.Male:
      switch (ageCategoryTitle) {
        case ageCategoriesTitle.Beginner:
        case ageCategoriesTitle.Intermediate:
          return generateSpeedValuesFromRange(sn === 1 ? 120 : 90, units);
        default:
          return generateSpeedValuesFromRange(sn === 1 ? 170 : 140, units);
      }
  }
};

export const oppSideId = 'opp-side';
