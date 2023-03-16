import { GameEvent } from "./events";
import { Command, AsyncCommand } from "../types";

export interface Game {
  id: string;
  startedAt: string | null;
  endedAt: string | null;
  players: Record<string, Player>;
  currentRound: Round | null;
  pastRounds: Round[];
}

export interface Round {
  id: string;
  startedAt: string;
  endedAt: string | null;
  status: RoundStatus;
  betEndTimer: number | null;
  result: RoundResult | null;
  question: string;
  answerA: string;
  answerB: string;
  bets: Record<string, Bet>;
}

export enum RoundStatus {
  BET_TIME = "BET_TIME",
  RUNNING = "RUNNING",
  OVER = "OVER",
}

export enum RoundResult {
  ANSWER_A = "ANSWER_A",
  ANSWER_B = "ANSWER_B",
}

export interface Player {
  id: string;
  name: string;
  balanceCents: number;
}

export interface Bet {
  expectedResult: RoundResult;
  amountCents: number;
}

export type GameCommand<O, E extends GameEvent> = Command<Game, O, E>;
export type GameAsyncCommand<O, E extends GameEvent> = AsyncCommand<Game, O, E>;
