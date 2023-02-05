import { Game } from "../state";
import { GameEvent } from "../events";

export type DefaultOption =
  | Record<string, boolean | string | number>
  | undefined
  | null;

export interface Command<O extends DefaultOption = undefined> {
  (state: Game, options: O, datetime?: string): GameEvent;
}
