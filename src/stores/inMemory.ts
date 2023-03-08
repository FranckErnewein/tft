import { AppendEvent, StreamEvents, SaveState, LoadState } from "./types";
import { promisify } from "../utils";

export function createStateStore<S>() {
  const states: Record<string, S> = {};

  const save: SaveState<S> = (key) =>
    promisify<S, S>((state) => {
      states[key] = state;
      return state;
    });

  const load: LoadState<S> = (key) =>
    promisify<undefined, S>(() => {
      return states[key];
    });

  return { save, load };
}

export function createEventStore<E>() {
  const events: Record<string, E[]> = {};

  const append: AppendEvent<E> = (key) =>
    promisify<E, E>((event) => {
      if (!events[key]) events[key] = [];
      events[key].push(event);
      return event;
    });

  const stream: StreamEvents<E> = (key) => (callback) => {
    (events[key] || []).forEach(callback);
  };

  return { append, stream };
}
