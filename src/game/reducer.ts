import {
  EventType,
  GameEvent,
  GameStarted,
  PlayerJoined,
  PlayerLeft,
  RoundStarted,
  PlayerBet,
  PlayerCancelBet,
  BetTimeDecreased,
  BetTimeEnded,
  RoundOver,
} from "./events";
import { Game, Player, Round, RoundStatus } from "./types";
import { GameError, StateError } from "./errors";
import defaultState from "./defaultState";
import { amountBet } from "../round/queries";

export interface Reducer<E extends GameEvent> {
  (state: Game, abstractEvent: E): Game;
}

export const onGameStarted: Reducer<GameStarted> = (_, event): Game => {
  return {
    ...defaultState,
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
    betEndTimer: null,
    result: null,
    question: event.payload.question,
    answerA: event.payload.answerA,
    answerB: event.payload.answerB,
    bets: {},
  };
  return {
    ...state,
    currentRound: newRound,
  };
};

export const onPlayerBet: Reducer<PlayerBet> = (state, event): Game => {
  if (!state.currentRound) throw new StateError("currentRound must exist");
  const { playerId, bet } = event.payload;
  const player = state.players[playerId];
  const existingBetAmount = state.currentRound?.bets[playerId]?.amountCents;
  const newBalance =
    player.balanceCents - bet.amountCents + (existingBetAmount || 0);
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

export const onPlayerCancelBet: Reducer<PlayerCancelBet> = (
  state,
  event
): Game => {
  const { playerId } = event.payload;
  const { currentRound, players } = state;
  if (!currentRound) throw new StateError("no current round");
  const bet = currentRound.bets[playerId];
  if (!bet) return state;
  const player = players[playerId];
  const { [playerId]: toDelete, ...rest } = currentRound.bets;
  return {
    ...state,
    players: {
      ...players,
      [playerId]: {
        ...player,
        balanceCents: player.balanceCents + bet.amountCents,
      },
    },
    currentRound: {
      ...currentRound,
      bets: rest,
    },
  };
};

export const onBetTimeDecreased: Reducer<BetTimeDecreased> = (
  state,
  event
): Game => {
  if (!state.currentRound) {
    throw new GameError("can not end bet, no current round");
  }
  return {
    ...state,
    currentRound: {
      ...state.currentRound,
      betEndTimer: event.payload.restTime,
    },
  };
};

export const onBetTimeEnded: Reducer<BetTimeEnded> = (state): Game => {
  if (!state.currentRound) {
    throw new GameError("can not end bet, no current round");
  }
  return {
    ...state,
    currentRound: {
      ...state.currentRound,
      betEndTimer: 0,
      status: RoundStatus.RUNNING,
    },
  };
};

export const onRoundOver: Reducer<RoundOver> = (state, event): Game => {
  const { currentRound } = state;
  const { roundResult } = event.payload;
  if (!currentRound) throw new StateError("no current round");
  const round = {
    ...currentRound,
    endedAt: event.datetime,
    result: roundResult,
    status: RoundStatus.OVER,
  };

  const { byLosers, byWinners } = amountBet(round);

  let players: Record<string, Player> = {
    ...state.players,
  };

  if (byWinners === 0) {
    Object.keys(round.bets).forEach((playerId: string) => {
      const bet = round.bets[playerId];
      players[playerId].balanceCents += bet.amountCents;
    });
  } else {
    Object.keys(round.bets).forEach((playerId: string) => {
      const bet = round.bets[playerId];
      const player = players[playerId];
      if (player && bet && bet.expectedResult === roundResult) {
        const odds = bet.amountCents / byWinners;
        players[playerId] = {
          ...player,
          balanceCents: player.balanceCents + bet.amountCents + byLosers * odds,
        };
      }
    });
  }

  return {
    ...state,
    players,
    currentRound: null,
    pastRounds: [...state.pastRounds, round],
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
    case EventType.PLAYER_BET:
      return onPlayerBet(state, event);
    case EventType.PLAYER_CANCEL_BET:
      return onPlayerCancelBet(state, event);
    case EventType.BET_TIME_DECREASED:
      return onBetTimeDecreased(state, event);
    case EventType.BET_TIME_ENDED:
      return onBetTimeEnded(state, event);
    case EventType.ROUND_OVER:
      return onRoundOver(state, event);
    default:
      return state;
  }
}
