import { timestamp } from "../../utils";
import { GameCommand } from "../types";
import { EventType, BetTimeEnded } from "../events";
import { RoundStatus } from "../types";
import { GameError } from "../errors";

export interface Options {}

const endBet: GameCommand<{}, BetTimeEnded> = (state) => {
  if (
    !state.currentRound ||
    state.currentRound.status !== RoundStatus.BET_TIME
  ) {
    throw new GameError("can not stop bet new");
  }
  return {
    type: EventType.BET_TIME_ENDED,
    datetime: timestamp(),
    payload: {},
  };
};

export default endBet;
