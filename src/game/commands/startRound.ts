import { v4 as uuid } from "uuid";
import { JTDDataType } from "ajv/dist/jtd";
import { createValidator } from "../utils";
import { timestamp } from "../../utils";
import { GameCommand } from "../types";
import { EventType, RoundStarted } from "../events";

const schema = {
  optionalProperties: {
    question: { type: "string" },
    answerA: { type: "string" },
    answerB: { type: "string" },
  },
} as const;

export type Options = JTDDataType<typeof schema> | undefined;
const validate = createValidator<Options>(schema);

export const defaultOptions: Required<Options> = {
  question: "Will the player win or lose the next round ?",
  answerA: "Win",
  answerB: "Lose",
};

const startRound: GameCommand<Options, RoundStarted> = (_, options) => {
  if (options) validate(options);
  return {
    type: EventType.ROUND_STARTED,
    datetime: timestamp(),
    payload: {
      roundId: uuid(),
      ...defaultOptions,
      ...options,
    },
  };
};

export default startRound;
