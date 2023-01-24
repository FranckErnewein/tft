import {
  AbstractEvent,
  EventType,
  GameEvent,
  GameStarted,
  PlayerJoined,
  PlayerLeft,
  RoundStarted,
  BetTimeStarted,
  PlayerBet,
} from "./events";
import { Game, EMPTY_GAME, Round, RoundStatus } from "./state";
import { GameError } from "./errors";

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

export const onPlayerLeft: Reducer<PlayerLeft> = (state, event): Game => {
  const { [event.payload.playerId]: _, ...rest } = state.players;
  return {
    ...state,
    players: rest,
  };
};

export const onRoundStarted: Reducer<RoundStarted> = (state, event): Game => {
  const newRound: Round = {
    id: event.payload.roundId,
    startedAt: event.datetime,
    endedAt: null,
    status: RoundStatus.BET_TIME,
    betEndTimer: 5,
    result: null,
    bets: {},
  };
  return {
    ...state,
    currentRound: newRound,
  };
};

export const onBetTimeStarted: Reducer<BetTimeStarted> = (state): Game => {
  if (!state.currentRound) {
    throw new GameError("can not start bet, no current round");
  }
  return {
    ...state,
    currentRound: {
      ...state.currentRound,
      status: RoundStatus.BET_TIME,
    },
  };
};

export const onPlayerBet: Reducer<PlayerBet> = (state, event): Game => {
  if (!state.currentRound) {
    throw new GameError("you can not bet, no round active");
  }
  return {
    ...state,
    currentRound: {
      ...state.currentRound,
      bets: {
        ...state.currentRound.bets,
        [event.payload.playerId]: event.payload.bet,
      },
    },
  };
};

export default function reducer(state: Game, event: GameEvent): Game {
  switch (event.type) {
    case EventType.GAME_STARTED:
      return onGameStarted(state, event);
    case EventType.PLAYER_JOINED:
      return onPlayerJoined(state, event);
    case EventType.PLAYER_LEFT:
      return onPlayerLeft(state, event);
    case EventType.ROUND_STARTED:
      return onRoundStarted(state, event);
    case EventType.BET_TIME_STARTED:
      return onBetTimeStarted(state, event);
    case EventType.PLAYER_BET:
      return onPlayerBet(state, event);
    default:
      return state;
  }
}
