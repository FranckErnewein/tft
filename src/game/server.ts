import { Game } from "./types";

interface SaveStateFunction {
  (state: Game): void | Promise<void>;
}

interface EventEmitterFunction {
  (state: Game): void | Promise<void>;
}
