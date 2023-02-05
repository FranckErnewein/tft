import { Game } from "../state";
import { GameEvent } from "../events";

export type DefaultOption =
  | Record<string, boolean | string | number>
  | undefined;

export interface EmitFunction<E = GameEvent> {
  (event: E): void;
}

export interface AbortFunction {
  (): void;
}

export interface Command<O extends DefaultOption = undefined, E = GameEvent> {
  (state: Game, options: O, datetime?: string): E;
}

export interface AsyncCommand<
  O extends DefaultOption = undefined,
  E = GameEvent
> {
  (
    state: Game,
    options: O,
    emit: EmitFunction<E>,
    done?: () => void,
    datetime?: string
  ): AbortFunction | void;
}
