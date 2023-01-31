import { JTDDataType } from "ajv/dist/jtd";
import { Command } from "./types";
import { EventType, PlayerLeft } from "../events";
import { GameError } from "../errors";
import { timestamp, createValidator } from "../utils";

const schema = {
  properties: {
    playerId: { type: "string" },
  },
} as const;

export type Options = JTDDataType<typeof schema>;
export const validate = createValidator<Options>(schema);

const command: Command<Options> = (game, options): PlayerLeft => {
  validate(options);
  if (!game.players[options.playerId]) {
    throw new GameError(`player ${options.playerId} does not exist`);
  }
  return {
    type: EventType.PLAYER_LEFT,
    datetime: timestamp(),
    payload: { playerId: options.playerId },
  };
};

export default command;
