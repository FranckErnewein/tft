import {
  AbstractEvent,
  EventType,
  GameEvent,
  GameStarted,
  PlayerJoined,
} from "./events";
import { Game, EMPTY_GAME } from "./state";

export interface Reducer<E extends AbstractEvent> {
  (state: Game, abstractEvent: E): Game;
}

export const onGameStarted: Reducer<GameStarted> = (_, event): Game => {
  return {
    ...EMPTY_GAME,
    id: event.payload.newGameId,
    startedAt: event.datetime,
  };
};

export const onPlayerJoined: Reducer<PlayerJoined> = (state, event): Game => {
  const { player } = event.payload;
  return {
    ...state,
    players: {
      ...state.players,
      [player.id]: player,
    },
  };
};

export default function reducer(state: Game, event: GameEvent): Game {
  switch (event.type) {
    case EventType.GAME_STARTED:
      return onGameStarted(state, event);
    case EventType.PLAYER_JOINED:
      return onPlayerJoined(state, event);
    default:
      return state;
  }
}
