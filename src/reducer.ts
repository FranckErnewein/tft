import {
  EventType,
  GameEvent,
  GameStarted,
  PlayerJoined,
  PlayerLeft,
  RoundStarted,
  BetTimeStarted,
  PlayerBet,
  RoundOver,
} from "./events";
import { Game, EMPTY_GAME, Player, Round, Bet, RoundStatus } from "./state";
import { GameError, StateError } from "./errors";

export interface Reducer<E extends GameEvent> {
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
  if (!state.currentRound) throw new StateError("currentRound must exist");
  const { playerId, bet } = event.payload;
  const player = state.players[playerId];
  const newBalance = player.balanceCents - bet.amountCents;
  return {
    ...state,
    players: {
      ...state.players,
      [playerId]: {
        ...player,
        balanceCents: newBalance,
      },
    },
    currentRound: {
      ...state.currentRound,
      bets: {
        ...state.currentRound?.bets,
        [playerId]: event.payload.bet,
      },
    },
  };
};

export const onRoundOver: Reducer<RoundOver> = (state, event): Game => {
  const { currentRound } = state;
  if (!currentRound) throw new StateError("no current round");
  const totalAmountBet: number = Object.values(currentRound.bets).reduce(
    (memo: number, bet: Bet) => bet.amountCents + memo,
    0
  );
  const players: Record<string, Player> = {};
  Object.values(state.players).forEach((player: Player) => {
    players[player.id] = {
      ...player,
    };
  });
  return {
    ...state,
    players,
    currentRound: null,
    pastRounds: [...state.pastRounds, currentRound],
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
    case EventType.ROUND_OVER:
      return onRoundOver(state, event);
    default:
      return state;
  }
}
