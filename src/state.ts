import { GameEvent } from "./events";
import { AbstractOptions, Command } from "./commands";
import reducer, { Reducer } from "./reducer";

export interface Game {
  id: string;
  startedAt: string | null;
  endedAt: string | null;
  players: Record<string, Player>;
  rounds: Round[];
}

export enum RoundStatus {
  BetTime = "BET_TIME",
  Running = "RUNNING",
  Over = "OVER",
}

export enum RoundResult {
  Win = "WIN",
  Lose = "LOSE",
}

export interface Round {
  id: string;
  startedAt: string;
  endedAt: string;
  status: RoundStatus;
  betEndTimer: number;
  result: RoundResult | null;
  bets: Record<string, Bet>;
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

export const EMPTY_GAME: Game = {
  id: "",
  startedAt: null,
  endedAt: null,
  players: {},
  rounds: [],
};

export class StateMachine {
  state: Game;
  callbacks: Record<string, Reducer<GameEvent>[]>;

  constructor() {
    this.callbacks = {};
    this.state = EMPTY_GAME;
  }

  execute<E extends GameEvent, O extends AbstractOptions = {}>(
    command: Command<E, O>,
    options: O
  ) {
    const event = command(this.state, options);
    this.state = reducer(this.state, event);
    return event;
  }
}
