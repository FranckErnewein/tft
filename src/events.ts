import { Player, Bet } from "./state";

export enum EventType {
  GAME_STARTED = "GAME_STARTED",
  PLAYER_JOINED = "PLAYER_JOINED",
  PLAYER_LEFT = "PLAYER_LEFT",
  ROUND_STARTED = "ROUND_STARTED",
  BET_TIME_STARTED = "BET_TIME_STARTED",
  BET_TIME_DECREASED = "BET_TIME_DECREASED",
  BET_TIME_ENDED = "BET_TIME_ENDED",
  PLAYER_BET = "PLAYER_BET",
  ROUND_OVER = "ROUND_OVER",
  GAME_OVER = "GAME_OVER",
}

type EventPayload = Record<string, unknown>;

export interface AbstractEvent {
  type: EventType;
  datetime: string;
  payload: EventPayload;
}

export interface GameStarted extends AbstractEvent {
  type: EventType.GAME_STARTED;
  payload: {
    newGameId: string;
  };
}

export interface PlayerJoined extends AbstractEvent {
  type: EventType.PLAYER_JOINED;
  payload: {
    player: Player;
  };
}

export interface PlayerLeft extends AbstractEvent {
  type: EventType.PLAYER_LEFT;
  payload: {
    playerId: string;
  };
}

export interface RoundStarted extends AbstractEvent {
  type: EventType.ROUND_STARTED;
  payload: {
    roundId: string;
  };
}

export interface BetTimeStarted extends AbstractEvent {
  type: EventType.BET_TIME_STARTED;
}

export interface PlayerBet extends AbstractEvent {
  type: EventType.PLAYER_BET;
  payload: {
    playerId: string;
    bet: Bet;
  };
}

export type GameEvent =
  | GameStarted
  | PlayerJoined
  | PlayerLeft
  | RoundStarted
  | BetTimeStarted
  | PlayerBet;
