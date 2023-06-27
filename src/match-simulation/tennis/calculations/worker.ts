import { CourtItem, StartType, TennisTrade, TennisTradePayload, UnityTrade, UnityTradeData } from '@core/contracts';
import { CalcDefaultValuesPayload } from '../types';
import { UwU, bottomCorner, topCorner } from './init';
import { UVector } from './unity-vector';

export const convertUnityTradeToState = ({ height, uTrade, width }: TennisTradePayload): TennisTrade => {
  if (!uTrade)
    return {
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

  const { ball, opponent, player, cannon } = uTrade;

  const ai = new UVector(...opponent.position);
  const ballU = new UVector(...ball.position);
  const playerU = new UVector(...player.position);
  const cannonU = cannon ? new UVector(...cannon.position) : UwU;

  return {
    coords: {
      ball: UwU.convertUVToCanvas(ballU, height, width, CourtItem.Ball),
      opponent: UwU.convertUVToCanvas(ai, height, width, CourtItem.AI),
      player: UwU.convertUVToCanvas(playerU, height, width, CourtItem.Player),
      cannon: UwU.convertUVToCanvas(cannonU, height, width, CourtItem.Cannon),
    },
  };
};

const calcOpponentPosition = ({ trade, isCannon }: { trade: UnityTrade; isCannon: boolean }) => {
  const vsPosition = isCannon && trade.cannon ? trade.cannon.position : trade.player.position;

  const slEndPoint = UwU.getStraightLineEndPoint(
    new UVector(...vsPosition),
    new UVector(...trade.ball.position!),
    UwU.distance(new UVector(...vsPosition), topCorner(new UVector(...vsPosition))),
  );

  const opponentPredicatePos = UwU.getHorizontalPredicatePoint(
    new UVector(...vsPosition),
    slEndPoint,
    new UVector(...trade.opponent.position),
  );

  const opponentNewPos = UwU.add(
    opponentPredicatePos,
    UwU.getVectorOffset(new UVector(...vsPosition), slEndPoint, UwU.getShotTypePosition(1, trade.opponent.shot_type), false),
  );

  return opponentNewPos;
};

const calcPlayerPosition = ({ trade }: { trade: UnityTrade }) => {
  const slEndPoint = UwU.getStraightLineEndPoint(
    new UVector(...trade.opponent.position),
    new UVector(...trade.ball.position!),
    UwU.distance(new UVector(...trade.opponent.position), bottomCorner(new UVector(...trade.opponent.position))),
  );

  const playerPredicate = UwU.getHorizontalPredicatePoint(
    new UVector(...trade.opponent.position),
    slEndPoint,
    new UVector(...trade.player.position),
  );

  const playerNewPos = UwU.add(
    playerPredicate,
    UwU.getVectorOffset(
      new UVector(...trade.opponent.position),
      slEndPoint,
      UwU.getPlayerSpaceFromZone(trade.player.strike_zone, trade.player.shot_type),
      false,
    ),
  );

  return {
    playerNewPos,
  };
};

export const calcDefaultItemsPositions = ({
  startType,
  tradeOrder,
  trades,
}: CalcDefaultValuesPayload): UnityTradeData | null => {
  switch (startType) {
    case StartType.Serve:
    case StartType.Rally:
      switch (tradeOrder) {
        case 1: {
          if (startType === StartType.Serve) {
            return {
              order: tradeOrder,
              config: {
                player: {
                  position: [5, 0, -12],
                },
                ball: {
                  position: [3.5, 0, 5.5],
                },
                opponent: {
                  position: [-5, 0, 12],
                },
              },
            };
          }
          return {
            order: tradeOrder,
            config: {
              player: {
                position: [5, 0, -12],
              },
              cannon: {
                position: [6.5, 0, -8],
              },
              ball: {
                position: [0, 0, 6.3],
              },
              opponent: {
                position: [-5, 0, 12],
              },
            },
          };
        }
        case 2: {
          const ts1 = trades.find(t => t.order === 1);
          if (!ts1) return null;

          const oppNewPos = calcOpponentPosition({
            trade: ts1.config,
            isCannon: startType === StartType.Rally,
          });

          return {
            order: tradeOrder,
            config: {
              player: {
                position: ts1.config.player.position,
              },
              ball: {
                position: ts1.config.ball.position,
              },
              opponent: {
                position: [oppNewPos.x, 0, oppNewPos.z],
              },
            },
          };
        }
        case 3: {
          const ts2 = trades.find(t => t.order === 2);
          if (!ts2) return null;

          const { playerNewPos } = calcPlayerPosition({
            trade: ts2.config,
          });

          return {
            order: tradeOrder,
            config: {
              player: {
                position: [playerNewPos.x, 0, playerNewPos.z],
              },
              ball: {
                position: ts2.config.ball.position,
              },
              opponent: {
                position: ts2.config.opponent.position,
              },
            },
          };
        }

        default:
          return null;
      }

    case StartType.Return:
      switch (tradeOrder) {
        case 1:
          return {
            order: tradeOrder,
            config: {
              player: {
                position: [5, 0, -12],
              },
              ball: {
                position: [-3.5, 0, -5.5],
              },
              opponent: {
                position: [-5, 0, 12],
              },
            },
          };
        case 2: {
          const ts1 = trades.find(t => t.order === 1);
          if (!ts1) return null;
          const { playerNewPos } = calcPlayerPosition({
            trade: ts1.config,
          });

          return {
            order: tradeOrder,
            config: {
              player: {
                position: [playerNewPos.x, 0, playerNewPos.z],
              },
              ball: {
                position: ts1.config.ball.position,
              },
              opponent: {
                position: ts1.config.opponent.position,
              },
            },
          };
        }
        case 3: {
          const ts2 = trades.find(t => t.order === 2);
          if (!ts2) return null;
          const oppNewPos = calcOpponentPosition({ trade: ts2.config, isCannon: false });

          return {
            order: tradeOrder,
            config: {
              player: {
                position: ts2.config.player.position,
              },
              ball: {
                position: ts2.config.ball.position,
              },
              opponent: {
                position: [oppNewPos.x, 0, oppNewPos.z],
              },
            },
          };
        }

        case 4: {
          const ts3 = trades.find(t => t.order === 3);
          if (!ts3) return null;
          const { playerNewPos } = calcPlayerPosition({
            trade: ts3.config,
          });

          return {
            order: tradeOrder,
            config: {
              player: {
                position: [playerNewPos.x, 0, playerNewPos.z],
              },
              ball: {
                position: ts3.config.ball.position,
              },
              opponent: {
                position: ts3.config.opponent.position,
              },
            },
          };
        }

        default:
          return null;
      }
  }
};
