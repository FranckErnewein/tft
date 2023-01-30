import { JTDDataType } from "ajv/dist/jtd";
import { Command } from "./types";
import { EventType, PlayerLeft } from "../events";
import { GameError } from "../errors";
import { timestamp, ajv } from "../utils";

const Schema = {
  properties: {
    playerId: { type: "string" },
  },
} as const;

export type Options = JTDDataType<typeof Schema>;
export const playerLeaveValidator = ajv.compile<Options>(Schema);

export const command: Command<PlayerLeft, Options> = (game, options) => {
  if (!game.players[options.playerId]) {
    throw new GameError(`player ${options.playerId} does not exist`);
  }
  return {
    type: EventType.PLAYER_LEFT,
    datetime: timestamp(),
    payload: { playerId: options.playerId },
  };
};
