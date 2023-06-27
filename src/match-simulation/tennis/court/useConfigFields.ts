import {
  StartType,
  TennisMatchServeRotation,
  TennisMatchShotType,
  TennisMatchStrikeApproach,
  TennisMatchStrikeType,
  TennisMatchStrikeZone,
} from '@core/contracts';
import { useStoreMap } from 'effector-react';
import { useMemo } from 'react';
import { extractCombinedKey } from '../calculations/operations';
import { $msSettings } from '../store.ms';
import { OpponentCfgPayload, PlayerCfgPayload } from '../types';
import {
  serveOps,
  serveRotationOps,
  serveSpeedOps,
  shotTypeOps,
  strikeAppOps,
  strikeTypeOps,
  strikeZoneOps,
} from './constants';

const useServeSpeedOps = () => {
  const { gender, units, ageCategoryTitle, serveNumber } = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const { tradeOrder } = extractCombinedKey(state.courtStepsHistory.at(-1));
      const trade = state.unityTradesA.find(t => t.order === tradeOrder);
      return {
        gender: state.settings.gender,
        units: state.settings.units,
        ageCategoryTitle: state.ageCategoryTitle,
        serveNumber: trade?.config.player.serve_number,
      };
    },
  });

  const serveSpeedOpsByServe = useMemo(() => {
    return {
      1: serveSpeedOps({
        gender,
        sn: 1,
        units,
        ageCategoryTitle,
      }),
      2: serveSpeedOps({
        gender,
        sn: 2,
        units,
        ageCategoryTitle,
      }),
    };
  }, [gender, units, ageCategoryTitle]);

  return serveSpeedOpsByServe[serveNumber ?? 1];
};

export const usePlayerConfigFields = () => {
  const { startType, tradeKey } = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const { tradeKey } = extractCombinedKey(state.courtStepsHistory.at(-1));
      return {
        startType: state.settings.type,
        tradeKey,
      };
    },
  });

  const ssOps = useServeSpeedOps();

  const prepareSelectFields = useMemo<
    | {
        [k in keyof PlayerCfgPayload]: {
          ops: any[];
          dv: any;
        };
      }
    | null
  >(() => {
    switch (startType) {
      case StartType.Serve:
        switch (tradeKey) {
          case 'trades-1':
            return {
              serve_number: {
                ops: serveOps,
                dv: 1,
              },
              serve_speed: {
                ops: ssOps,
                dv: ssOps[0].value,
              },
            };

          case 'trades-2':
            return {
              strike_approach: {
                ops: strikeAppOps,
                dv: TennisMatchStrikeApproach.AfterBounce,
              },
              strike_zone: {
                ops: strikeZoneOps,
                dv: TennisMatchStrikeZone.Comfort,
              },
              shot_type: {
                ops: shotTypeOps,
                dv: TennisMatchShotType.Forehand,
              },
            };

          default:
            return null;
        }
      case StartType.Return:
        switch (tradeKey) {
          case 'trades-1':
            return {
              strike_approach: {
                ops: strikeAppOps,
                dv: TennisMatchStrikeApproach.AfterBounce,
              },
              strike_zone: {
                ops: strikeZoneOps,
                dv: TennisMatchStrikeZone.Comfort,
              },
              shot_type: {
                ops: shotTypeOps,
                dv: TennisMatchShotType.Forehand,
              },
            };

          case 'trades-3':
            return {
              strike_approach: {
                ops: strikeAppOps,
                dv: TennisMatchStrikeApproach.AfterBounce,
              },
              strike_zone: {
                ops: strikeZoneOps,
                dv: TennisMatchStrikeZone.Comfort,
              },
              shot_type: {
                ops: shotTypeOps,
                dv: TennisMatchShotType.Forehand,
              },
            };

          default:
            return null;
        }

      case StartType.Rally:
        switch (tradeKey) {
          case 'trades-2':
            return {
              strike_approach: {
                ops: strikeAppOps,
                dv: TennisMatchStrikeApproach.AfterBounce,
              },
              strike_zone: {
                ops: strikeZoneOps,
                dv: TennisMatchStrikeZone.Comfort,
              },
              shot_type: {
                ops: shotTypeOps,
                dv: TennisMatchShotType.Forehand,
              },
            };

          default:
            return null;
        }
    }
  }, [startType, tradeKey, ssOps]);

  return prepareSelectFields;
};

export const useOpponentConfigFields = () => {
  const { startType, tradeKey } = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const { tradeKey } = extractCombinedKey(state.courtStepsHistory.at(-1));

      return {
        startType: state.settings.type,
        tradeKey,
      };
    },
  });

  const ssOps = useServeSpeedOps();

  const prepareSelectFields = useMemo<
    | {
        [k in keyof OpponentCfgPayload]: {
          ops: any[];
          dv: any;
        };
      }
    | null
  >(() => {
    switch (startType) {
      case StartType.Serve:
        switch (tradeKey) {
          case 'trades-1':
            return {
              shot_type: {
                ops: shotTypeOps,
                dv: TennisMatchShotType.Forehand,
              },
              strike_type: {
                ops: strikeTypeOps,
                dv: TennisMatchStrikeType.Drive,
              },
            };

          default:
            return null;
        }
      case StartType.Return:
        switch (tradeKey) {
          case 'trades-1':
            return {
              serve_number: {
                ops: serveOps,
                dv: 1,
              },
              serve_speed: {
                ops: ssOps,
                dv: ssOps[0].value,
              },
              serve_rotation: {
                ops: serveRotationOps,
                dv: TennisMatchServeRotation.Flat,
              },
            };

          case 'trades-2':
            return {
              strike_approach: {
                ops: strikeAppOps,
                dv: TennisMatchStrikeApproach.AfterBounce,
              },
              strike_type: {
                ops: strikeTypeOps,
                dv: TennisMatchStrikeType.Drive,
              },
              shot_type: {
                ops: shotTypeOps,
                dv: TennisMatchShotType.Forehand,
              },
            };

          default:
            return null;
        }

      case StartType.Rally:
        switch (tradeKey) {
          case 'trades-1':
            return {
              strike_approach: {
                ops: strikeAppOps,
                dv: TennisMatchStrikeApproach.AfterBounce,
              },
              strike_type: {
                ops: strikeTypeOps,
                dv: TennisMatchStrikeType.Drive,
              },
              shot_type: {
                ops: shotTypeOps,
                dv: TennisMatchShotType.Forehand,
              },
            };

          default:
            return null;
        }
    }
  }, [startType, tradeKey, ssOps]);

  return prepareSelectFields;
};
