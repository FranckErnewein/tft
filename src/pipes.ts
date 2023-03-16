import { AsyncCommand, Command, Reducer } from "./types";

export interface StateLoader<S> {
  (): Promise<S>;
}

export interface EventHandler<E> {
  (event: E): Promise<void>;
}

export interface StateHandler<S> {
  (state: S): Promise<void>;
}
export function pipeCommand<O, E, S>(
  getState: StateLoader<S>,
  command: Command<S, O, E>,
  eventHandler: EventHandler<E>,
  reducer: Reducer<S, E>,
  stateHandler: StateHandler<S>
): (options: O) => Promise<[S, E]> {
  return async function (options: O) {
    let state: S = await getState();
    const event = command(state, options);
    await eventHandler(event);
    state = reducer(state, event);
    await stateHandler(state);
    return [state, event];
  };
}

export function pipeAsyncCommand<O, E, S>(
  getState: StateLoader<S>,
  command: AsyncCommand<S, O, E>,
  eventHandler: EventHandler<E>,
  reducer: Reducer<S, E>,
  stateHandler: StateHandler<S>
): (options: O) => Promise<[S, E[]]> {
  return async function (options: O) {
    let state: S = await getState();
    const events: E[] = [];
    return new Promise((resolve) => {
      command(
        state,
        options,
        (event: E) => {
          state = reducer(state, event);
          events.push(event);
          eventHandler(event);
          stateHandler(reducer(state, event));
        },
        () => {
          resolve([state, events]);
        }
      );
    });
  };
}
