import { v4 as uuid } from "uuid";
import { Command } from "../StateMachine";
import { Game } from "../state";
import { EventType, GameStarted } from "../events";
import { timestamp } from "../utils";

const startGame: Command<Game, undefined, GameStarted> = () => {
  return {
    type: EventType.GAME_STARTED,
    datetime: timestamp(),
    payload: {
      newGameId: uuid(),
    },
  };
};

export default startGame;
