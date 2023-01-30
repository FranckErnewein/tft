import { Game } from "../state";
import { AbstractEvent } from "../events";

export type PrimitiveCommandOptionsTypes =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | boolean[];
export type AbstractOptions = Record<string, PrimitiveCommandOptionsTypes>;
// export type AbstractOptions = { [key: string]: PrimitiveCommandOptionsTypes };

export interface Command<
  E extends AbstractEvent,
  O extends AbstractOptions = {}
> {
  (state: Game, options: O, datetime?: string): E;
}
