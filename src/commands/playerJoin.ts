import { v4 as uuid } from "uuid";
import { JTDDataType } from "ajv/dist/jtd";
import { Command } from "./types";
import { EventType, PlayerJoined } from "../events";
import { GameError } from "../errors";
import { timestamp, ajv } from "../utils";

const Schema = {
  properties: {
    playerName: { type: "string" },
  },
} as const;

export type Options = JTDDataType<typeof Schema>;
export const playerJoinValidator = ajv.compile<Options>(Schema);

export const command: Command<PlayerJoined, Options> = (game, options) => {
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
