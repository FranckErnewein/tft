import { AsyncCommand, Command, Reducer } from "./types";

export interface StateLoader<S> {
  (_: undefined): Promise<S>;
}

export interface EventHandler<E> {
  (event: E): Promise<E>;
}

export interface StateHandler<S> {
  (state: S): Promise<S>;
}

export function pipeCommand<O, E, S>(
  getState: StateLoader<S>,
  command: Command<S, O, E>,
  eventHandler: EventHandler<E>,
  reducer: Reducer<S, E>,
  stateHandler: StateHandler<S>
): (options: O) => Promise<S> {
  return async function (options: O) {
    const state = await getState(undefined);
    return eventHandler(command(state, options)).then((event: E) => {
      return stateHandler(reducer(state, event));
    });
  };
}

export function pipeAsyncCommand<O, E, S>(
  getState: StateLoader<S>,
  command: AsyncCommand<S, O, E>,
  eventHandler: EventHandler<E>,
  reducer: Reducer<S, E>,
  stateHandler: StateHandler<S>
): (options: O) => void {
  return function (options: O) {
    getState(undefined).then((state) => {
      command(state, options, (event: E) => {
        eventHandler(event);
        stateHandler(reducer(state, event));
      });
    });
  };
}
