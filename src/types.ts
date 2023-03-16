export interface AsyncCommand<S, O, E> {
  (state: S, options: O, emit: (event: E) => void, done: () => void): void;
}

export interface Command<S, O = {}, E = {}> {
  (state: S, options: O): E;
}

export interface Reducer<S, E> {
  (state: S, event: E): S;
}
