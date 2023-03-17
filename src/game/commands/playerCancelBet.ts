import { JTDDataType } from "ajv/dist/jtd";
import { createValidator } from "../utils";
import { timestamp } from "../../utils";
import { GameCommand } from "../types";
import { EventType, PlayerCancelBet } from "../events";
import { GameError } from "../errors";

const schema = {
  properties: {
    playerId: { type: "string" },
  },
} as const;

export type Options = JTDDataType<typeof schema>;
export const validate = createValidator<Options>(schema);

const playerCancelBet: GameCommand<Options, PlayerCancelBet> = (
  state,
  options
) => {
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
