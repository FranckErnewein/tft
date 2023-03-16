export interface AppendEvent<E> {
  (aggregateId: string): (event: E) => Promise<void>;
}

export interface StreamEvents<E> {
  (aggregateId: string): (onEvent: (event: E) => void) => void;
}

export interface SaveState<S> {
  (objectId: string): (state: S) => Promise<void>;
}

export interface ResetState {
  (objectId: string): () => Promise<void>;
}

export interface LoadState<S> {
  (objectId: string): () => Promise<S>;
}
