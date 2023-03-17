import { JTDDataType } from "ajv/dist/jtd";
import { createValidator } from "../utils";
import { timestamp } from "../../utils";
import { GameCommand } from "../types";
import { EventType, PlayerLeft } from "../events";
import { GameError } from "../errors";

const schema = {
  properties: {
    playerId: { type: "string" },
  },
} as const;

export type Options = JTDDataType<typeof schema>;
export const validate = createValidator<Options>(schema);

const playerLeave: GameCommand<Options, PlayerLeft> = (game, options) => {
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

export default playerLeave;
