import { JTDDataType } from "ajv/dist/jtd";
import { Command } from "./types";
import { EventType, PlayerCancelBet } from "../events";
import { GameError } from "../errors";
import { timestamp, createValidator } from "../utils";

const schema = {
  properties: {
    playerId: { type: "string" },
  },
} as const;

export type Options = JTDDataType<typeof schema>;
export const validate = createValidator<Options>(schema);

const playerCancelBet: Command<Options> = (
  state,
  options: Options
): PlayerCancelBet => {
  validate(options);
  if (!state.players[options.playerId]) {
    throw new GameError(`player not found`);
  }
  return {
    type: EventType.PLAYER_CANCEL_BET,
    datetime: timestamp(),
    payload: {
      playerId: options.playerId,
    },
  };
};

export default playerCancelBet;
