import { v4 as uuid } from "uuid";
import { Command } from "./types";
import { EventType, RoundOver } from "../events";
import { timestamp } from "../utils";

const command: Command = (): RoundOver => {
  return {
    type: EventType.ROUND_OVER,
    datetime: timestamp(),
    payload: {
      roundId: uuid(),
    },
  };
};

export default command;
