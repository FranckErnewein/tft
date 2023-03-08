import { AsyncCommand, Command, Reducer } from "./types";

export interface EventHandler<E> {
  (event: E): Promise<E>;
}

export interface StateHandler<S> {
  (state: S): Promise<S>;
}

export function pipeCommand<O, E, S>(
  initalState: S,
  command: Command<S, O, E>,
  eventHandler: EventHandler<E>,
  reducer: Reducer<S, E>,
  stateHandler: StateHandler<S>
): (options: O) => Promise<S> {
  let state = initalState;
  return async function (options: O) {
    return eventHandler(command(initalState, options)).then((event: E) => {
      state = reducer(state, event);
      return stateHandler(state);
    });
  };
}

export function pipeAsyncCommand<O, E, S>(
  initalState: S,
  command: AsyncCommand<S, O, E>,
  eventHandler: EventHandler<E>,
  reducer: Reducer<S, E>,
  stateHandler: StateHandler<S>
): (options: O) => void {
  let state = initalState;
  return function (options: O) {
    command(state, options, (event: E) => {
      eventHandler(event);
      state = reducer(state, event);
      stateHandler(state);
    });
  };
}
