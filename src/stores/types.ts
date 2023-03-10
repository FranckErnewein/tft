export interface AppendEvent<E> {
  (aggregateId: string): (event: E) => Promise<E>;
}

export interface StreamEvents<E> {
  (aggregateId: string): (onEvent: (event: E) => void) => void;
}

export interface SaveState<S> {
  (objectId: string): (state: S) => Promise<S>;
}

export interface ResetState<S> {
  (objectId: string): (_: undefined) => Promise<S>;
}

export interface LoadState<S> {
  (objectId: string): (_: undefined) => Promise<S>;
}
