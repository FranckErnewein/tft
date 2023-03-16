import { v4 as uuid } from "uuid";
import { GameCommand } from "../types";
import { EventType, GameStarted } from "../events";
import { timestamp } from "../../utils";

export interface Options {}

const startGame: GameCommand<Options, GameStarted> = () => {
  return {
    type: EventType.GAME_STARTED,
    datetime: timestamp(),
    payload: {
      newGameId: uuid(),
    },
  };
};

export default startGame;
