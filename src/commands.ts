import { v4 as uuid } from "uuid";
import { EventType, AbstractEvent, GameStarted, PlayerJoined } from "./events";
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

export const startGame: Command<GameStarted> = (game) => {
  if (game.id) {
    throw new GameError("Game already started");
  }
  return {
    type: EventType.GAME_STARTED,
    datetime: new Date().toISOString(),
    payload: {
      newGameId: uuid(),
    },
  };
};

export interface PlayerJoinOptions extends AbstractOptions {
  playerName: string;
}

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
    datetime: new Date().toISOString(),
    payload: {
      player: {
        id: uuid(),
        name: options.playerName,
        balanceCents: 10,
      },
    },
  };
};
