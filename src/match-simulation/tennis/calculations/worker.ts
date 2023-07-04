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
    case StartType.Rally: {
      if (tradeOrder === 1) {
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

      const prevTs = trades.find(t => t.order === tradeOrder - 1);
      if (!prevTs) return null;
      if (tradeOrder % 2 === 0) {
        const oppNewPos = calcOpponentPosition({
          trade: prevTs.config,
          isCannon: startType === StartType.Rally,
        });

        return {
          order: tradeOrder,
          config: {
            player: {
              position: prevTs.config.player.position,
            },
            ball: {
              position: prevTs.config.ball.position,
            },
            opponent: {
              position: [oppNewPos.x, 0, oppNewPos.z],
            },
          },
        };
      } else {
        const { playerNewPos } = calcPlayerPosition({
          trade: prevTs.config,
        });

        return {
          order: tradeOrder,
          config: {
            player: {
              position: [playerNewPos.x, 0, playerNewPos.z],
            },
            ball: {
              position: prevTs.config.ball.position,
            },
            opponent: {
              position: prevTs.config.opponent.position,
            },
          },
        };
      }
    }

    case StartType.Return: {
      if (tradeOrder === 1) {
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
      }
      const prevTs = trades.find(t => t.order === tradeOrder - 1);
      if (!prevTs) return null;

      if (tradeOrder % 2 === 0) {
        const { playerNewPos } = calcPlayerPosition({
          trade: prevTs.config,
        });

        return {
          order: tradeOrder,
          config: {
            player: {
              position: [playerNewPos.x, 0, playerNewPos.z],
            },
            ball: {
              position: prevTs.config.ball.position,
            },
            opponent: {
              position: prevTs.config.opponent.position,
            },
          },
        };
      } else {
        const oppNewPos = calcOpponentPosition({ trade: prevTs.config, isCannon: false });

        return {
          order: tradeOrder,
          config: {
            player: {
              position: prevTs.config.player.position,
            },
            ball: {
              position: prevTs.config.ball.position,
            },
            opponent: {
              position: [oppNewPos.x, 0, oppNewPos.z],
            },
          },
        };
      }
    }
  }
};
