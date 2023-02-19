import { GameEvent } from "./events";
import { Command, AsyncCommand, DefaultOption } from "./commands/types";
import reducer from "./reducer";

export interface Game {
  id: string;
  startedAt: string | null;
  endedAt: string | null;
  players: Record<string, Player>;
  currentRound: Round | null;
  pastRounds: Round[];
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

export interface Round {
  id: string;
  startedAt: string;
  endedAt: string | null;
  status: RoundStatus;
  betEndTimer: number | null;
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
  currentRound: null,
  pastRounds: [],
};

export class StateMachine {
  state: Game;

  constructor() {
    this.state = EMPTY_GAME;
  }

  emit(event: GameEvent) {
    this.state = reducer(this.state, event);
  }

  execute<E extends GameEvent = GameEvent, O extends DefaultOption = undefined>(
    command: Command<O>,
    options?: O
  ): E {
    const event = command(this.state, options as O) as E;
    this.emit(event);
    return event;
  }

  executeAsync<E extends GameEvent, O extends DefaultOption = undefined>(
    command: AsyncCommand<O, E>,
    options?: O,
    onEmit?: (e: E) => void,
    onDone?: () => void
  ) {
    command(
      this.state,
      options as O,
      (e) => {
        this.emit(e);
        if (onEmit) onEmit(e);
      },
      onDone
    );
  }
}
