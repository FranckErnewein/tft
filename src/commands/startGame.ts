import { v4 as uuid } from "uuid";
import { Command } from "./types";
import { EventType, GameStarted } from "../events";
import { timestamp } from "../utils";

export type Options = {};

export const command: Command<GameStarted> = () => {
  return {
    type: EventType.GAME_STARTED,
    datetime: timestamp(),
    payload: {
      newGameId: uuid(),
    },
  };
};