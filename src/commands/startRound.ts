import { v4 as uuid } from "uuid";
import { Command } from "./types";
import { EventType, RoundStarted } from "../events";
import { timestamp } from "../utils";

const command: Command = (): RoundStarted => {
  return {
    type: EventType.ROUND_STARTED,
    datetime: timestamp(),
    payload: {
      roundId: uuid(),
    },
  };
};

export default command;
