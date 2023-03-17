import { JTDDataType } from "ajv/dist/jtd";
import { createValidator } from "../utils";
import { timestamp } from "../../utils";
import { GameCommand, RoundResult } from "../types";
import { EventType, RoundOver } from "../events";

const schema = {
  properties: {
    roundResult: { enum: [RoundResult.ANSWER_A, RoundResult.ANSWER_B] },
  },
} as const;

export type Options = JTDDataType<typeof schema>;
const validate = createValidator<Options>(schema);

const endRound: GameCommand<Options, RoundOver> = (_, options) => {
  validate(options);
  return {
    type: EventType.ROUND_OVER,
    datetime: timestamp(),
    payload: { roundResult: options.roundResult },
  };
};

export default endRound;
