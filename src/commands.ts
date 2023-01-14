import { v4 as uuid } from "uuid";
import Ajv, { JTDDataType } from "ajv/dist/jtd";
import {
  EventType,
  AbstractEvent,
  GameStarted,
  PlayerJoined,
  RoundStarted,
} from "./events";
import { Game } from "./state";
import { GameError } from "./errors";

export type PrimitiveCommandOptionsTypes =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | boolean[];
export type AbstractOptions = Record<string, PrimitiveCommandOptionsTypes>;

export interface Command<
  E extends AbstractEvent,
  O extends AbstractOptions = {}
> {
  (state: Game, options: O, datetime?: string): E;
}

const ajv = new Ajv();

function timestamp(d = new Date()): string {
  return d.toString();
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

const PlayerOptionSchema = {
  properties: {
    playerName: { type: "string" },
  },
} as const;

export type PlayerJoinOptions = JTDDataType<typeof PlayerOptionSchema>;
export const playerJoinValidator =
  ajv.compile<PlayerJoinOptions>(PlayerOptionSchema);

export const playerJoin: Command<PlayerJoined, PlayerJoinOptions> = (
  game,
  options
) => {
  Object.keys(game.players)
    .map((playerId) => game.players[playerId])
    .forEach((player) => {
      if (player && player.name === options.playerName)
        throw new GameError("name already use");
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
