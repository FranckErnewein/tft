import {
  StateStore,
  AppendEvent,
  StreamEvents,
  SaveState,
  LoadState,
  ResetState,
} from "./types";
import {
  promisify,
  promisifyToNothing,
  promisifyFromAndToNothing,
} from "../utils";

export function createStateStore<S>(defaultState: S): StateStore<S> {
  const states: Record<string, S> = {};

  const reset: ResetState = (key: string) =>
    promisifyFromAndToNothing(() => {
      states[key] = defaultState;
      return defaultState;
    });

  const save: SaveState<S> = (key) =>
    promisifyToNothing<S>((state) => {
      if (!state) throw new Error("state no define");
      states[key] = state;
    });

  const load: LoadState<S> = (key) =>
    promisify<undefined, S>(() => {
      return states[key] || defaultState;
    });

  return { save, load, reset };
}

export function createEventStore<E>() {
  const events: Record<string, E[]> = {};

  const append: AppendEvent<E> = (key) =>
    promisifyToNothing<E>((event) => {
      if (!event) throw new Error("event not defined");
      if (!events[key]) events[key] = [];
      events[key].push(event);
    });

  const stream: StreamEvents<E> = (key) => (callback) => {
    (events[key] || []).forEach(callback);
  };

  return { append, stream };
}
