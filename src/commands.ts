import { v4 as uuid } from "uuid";
import Ajv, { JTDDataType } from "ajv/dist/jtd";
import {
  EventType,
  AbstractEvent,
  GameStarted,
  PlayerJoined,
  RoundStarted,
  BetTimeStarted,
  PlayerBet,
  PlayerLeft,
} from "./events";
import { Game, RoundResult } from "./state";
import { GameError } from "./errors";

export type PrimitiveCommandOptionsTypes =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | boolean[];
export type AbstractOptions = Record<string, PrimitiveCommandOptionsTypes>;
// export type AbstractOptions = { [key: string]: PrimitiveCommandOptionsTypes };

export interface Command<
  E extends AbstractEvent,
  O extends AbstractOptions = {}
> {
  (state: Game, options: O, datetime?: string): E;
}

const ajv = new Ajv();

function timestamp(d = new Date()): string {
  return d.toISOString();
}

export type StartGameOptions = {};
export const startGame: Command<GameStarted> = () => {
  return {
    type: EventType.GAME_STARTED,
    datetime: timestamp(),
    payload: {
      newGameId: uuid(),
    },
  };
};

const PlayerJoinSchema = {
  properties: {
    playerName: { type: "string" },
  },
} as const;

export type PlayerJoinOptions = JTDDataType<typeof PlayerJoinSchema>;
export const playerJoinValidator =
  ajv.compile<PlayerJoinOptions>(PlayerJoinSchema);

export const playerJoin: Command<PlayerJoined, PlayerJoinOptions> = (
  game,
  options
) => {
  Object.keys(game.players)
    .map((playerId) => game.players[playerId])
    .forEach((player) => {
      if (player && player.name === options.playerName)
        throw new GameError("name already used");
    });
  return {
    type: EventType.PLAYER_JOINED,
    datetime: timestamp(),
    payload: {
      player: {
        id: uuid(),
        name: options.playerName,
        balanceCents: 1000,
      },
    },
  };
};

const PlayerLeaveSchema = {
  properties: {
    playerId: { type: "string" },
  },
} as const;

export type PlayerLeaveOptions = JTDDataType<typeof PlayerLeaveSchema>;
export const playerLeaveValidator =
  ajv.compile<PlayerLeaveOptions>(PlayerLeaveSchema);

export const playerLeave: Command<PlayerLeft, PlayerLeaveOptions> = (
  game,
  options
) => {
  if (!game.players[options.playerId]) {
    throw new GameError(`player ${options.playerId} does not exist`);
  }
  return {
    type: EventType.PLAYER_LEFT,
    datetime: timestamp(),
    payload: { playerId: options.playerId },
  };
};

export type StartRoundOptions = {};

export const startRound: Command<RoundStarted> = () => {
  return {
    type: EventType.ROUND_STARTED,
    datetime: timestamp(),
    payload: {
      roundId: uuid(),
    },
  };
};

export type StartBetOptions = {};

export const startBet: Command<BetTimeStarted> = (state) => {
  if (!state.currentRound) {
    throw new GameError("can not start bet, no current round");
  }
  return {
    type: EventType.BET_TIME_STARTED,
    datetime: timestamp(),
    payload: {},
  };
};

const PlayerBetOptionSchema = {
  properties: {
    amountCents: { type: "uint8" },
    win: { type: "boolean" },
    playerId: { type: "string" },
  },
} as const;

export type PlayerBetOptions = JTDDataType<typeof PlayerBetOptionSchema>;
export const playerBetValidator = ajv.compile<PlayerBetOptions>(
  PlayerBetOptionSchema
);

export const playerBet: Command<PlayerBet, PlayerBetOptions> = (_, options) => {
  return {
    type: EventType.PLAYER_BET,
    datetime: timestamp(),
    payload: {
      playerId: options.playerId,
      bet: {
        amountCents: options.amountCents,
        expectedResult: options.win ? RoundResult.WIN : RoundResult.LOSE,
      },
    },
  };
};
