import { Player, Bet, RoundResult } from "./state";

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

interface BaseEvent {
  type: EventType;
  datetime: string;
  payload: Record<string, unknown>;
}

export interface GameStarted extends BaseEvent {
  type: EventType.GAME_STARTED;
  payload: {
    newGameId: string;
  };
}

export interface PlayerJoined extends BaseEvent {
  type: EventType.PLAYER_JOINED;
  payload: {
    player: Player;
  };
}

export interface PlayerLeft extends BaseEvent {
  type: EventType.PLAYER_LEFT;
  payload: {
    playerId: string;
  };
}

export interface RoundStarted extends BaseEvent {
  type: EventType.ROUND_STARTED;
  payload: {
    roundId: string;
  };
}

export interface BetTimeStarted extends BaseEvent {
  type: EventType.BET_TIME_STARTED;
}

export interface PlayerBet extends BaseEvent {
  type: EventType.PLAYER_BET;
  payload: {
    playerId: string;
    bet: Bet;
  };
}

export interface RoundOver extends BaseEvent {
  type: EventType.ROUND_OVER;
  payload: {
    roundResult: RoundResult;
  };
}

export type GameEvent =
  | GameStarted
  | PlayerJoined
  | PlayerLeft
  | RoundStarted
  | BetTimeStarted
  | PlayerBet
  | RoundOver;
