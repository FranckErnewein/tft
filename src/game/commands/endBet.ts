import { timestamp } from "../../utils";
import { Command } from "./types";
import { EventType, BetTimeEnded } from "../events";
import { RoundStatus } from "../types";
import { GameError } from "../errors";

const endBet: Command = (state): BetTimeEnded => {
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
