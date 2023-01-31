import { Game } from "../state";
import { GameEvent } from "../events";

export type DefaultOption = Record<string, boolean | string | number>;

export interface Command<O = DefaultOption> {
  (state: Game, options: O, datetime?: string): GameEvent;
}
