import { Command } from "./types";
import { EventType, BetTimeStarted } from "../events";
import { GameError } from "../errors";
import { timestamp } from "../utils";
export type Options = {};

export const command: Command<BetTimeStarted> = (state) => {
  if (!state.currentRound) {
    throw new GameError("can not start bet, no current round");
  }
  return {
    type: EventType.BET_TIME_STARTED,
    datetime: timestamp(),
    payload: {},
  };
};
