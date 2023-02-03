import { JTDDataType } from "ajv/dist/jtd";
import { Command } from "./types";
import { RoundResult } from "../state";
import { EventType, RoundOver } from "../events";
import { timestamp, createValidator } from "../utils";

const schema = {
  properties: {
    roundResult: { enum: [RoundResult.WIN, RoundResult.LOSE] },
  },
} as const;

export type Options = JTDDataType<typeof schema>;
const validate = createValidator<Options>(schema);

const command: Command<Options> = (_, options): RoundOver => {
  validate(options);
  return {
    type: EventType.ROUND_OVER,
    datetime: timestamp(),
    payload: { roundResult: options.roundResult },
  };
};

export default command;
