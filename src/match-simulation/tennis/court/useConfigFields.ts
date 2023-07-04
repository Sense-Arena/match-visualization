import {
  StartType,
  TennisMatchServeRotation,
  TennisMatchShotType,
  TennisMatchSituationType,
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
  situationTypeOps,
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
  const { startType, tradeOrder } = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const { tradeOrder } = extractCombinedKey(state.courtStepsHistory.at(-1));
      return {
        startType: state.settings.type,
        tradeOrder,
      };
    },
  });

  const ssOps = useServeSpeedOps();

  const prepareSelectFields = useMemo<
    | {
        [k in keyof PlayerCfgPayload]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ops: any[];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dv: any;
        };
      }
    | null
  >(() => {
    switch (startType) {
      case StartType.Serve: {
        if (tradeOrder === 1) {
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
        }

        if (tradeOrder % 2 === 0) {
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
        }

        return null;
      }
      case StartType.Return: {
        if (tradeOrder % 2 !== 0) {
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
        }
        return null;
      }

      case StartType.Rally: {
        if (tradeOrder % 2 === 0) {
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
        }
        return null;
      }
    }
  }, [startType, tradeOrder, ssOps]);

  return prepareSelectFields;
};

export const useOpponentConfigFields = () => {
  const { startType, tradeOrder } = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const { tradeOrder } = extractCombinedKey(state.courtStepsHistory.at(-1));

      return {
        startType: state.settings.type,
        tradeOrder,
      };
    },
  });

  const ssOps = useServeSpeedOps();

  const prepareSelectFields = useMemo<
    | {
        [k in keyof OpponentCfgPayload]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ops: any[];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dv: any;
        };
      }
    | null
  >(() => {
    switch (startType) {
      case StartType.Serve: {
        if (tradeOrder % 2 !== 0) {
          return {
            shot_type: {
              ops: shotTypeOps,
              dv: TennisMatchShotType.Forehand,
            },
            strike_type: {
              ops: strikeTypeOps,
              dv: TennisMatchStrikeType.Topspin,
            },
            situation_type: {
              ops: situationTypeOps,
              dv: TennisMatchSituationType.Offensive,
            },
          };
        }
        return null;
      }
      case StartType.Return: {
        if (tradeOrder === 1) {
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
        }

        if (tradeOrder % 2 === 0) {
          return {
            strike_approach: {
              ops: strikeAppOps,
              dv: TennisMatchStrikeApproach.AfterBounce,
            },
            strike_type: {
              ops: strikeTypeOps,
              dv: TennisMatchStrikeType.Topspin,
            },
            shot_type: {
              ops: shotTypeOps,
              dv: TennisMatchShotType.Forehand,
            },
          };
        }

        return null;
      }

      case StartType.Rally: {
        if (tradeOrder % 2 !== 0) {
          return {
            strike_approach: {
              ops: strikeAppOps,
              dv: TennisMatchStrikeApproach.AfterBounce,
            },
            strike_type: {
              ops: strikeTypeOps,
              dv: TennisMatchStrikeType.Topspin,
            },
            shot_type: {
              ops: shotTypeOps,
              dv: TennisMatchShotType.Forehand,
            },
          };
        }
        return null;
      }
    }
  }, [startType, tradeOrder, ssOps]);

  return prepareSelectFields;
};
