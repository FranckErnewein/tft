import { Command } from "./types";
import { EventType, BetTimeStarted } from "../events";
import { GameError } from "../errors";
import { timestamp } from "../utils";

const startBet: Command = (state): BetTimeStarted => {
  if (!state.currentRound) {
    throw new GameError("can not start bet, no current round");
  }
  return {
    type: EventType.BET_TIME_STARTED,
    datetime: timestamp(),
    payload: {},
  };
};

export default startBet;
