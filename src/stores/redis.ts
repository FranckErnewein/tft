import { createClient, RedisClientType } from "redis";
import {
  StateStore,
  SaveState,
  LoadState,
  ResetState,
  AppendEvent,
  StreamEvents,
} from "./types";

let client: RedisClientType;
export async function getClient(): Promise<RedisClientType> {
  if (!client) {
    client = createClient();
    await client.connect();
  }
  return client;
}

export function createStateStore<S>(defaultState: S): StateStore<S> {
  const reset: ResetState = (key) => async () => {
    await (await getClient()).DEL(key);
    return;
  };

  const load: LoadState<S> = (key) => async () => {
    const str = await (await getClient()).GET(key);
    return str ? (JSON.parse(str) as S) : defaultState;
  };

  const save: SaveState<S> = (key) => async (data: S) => {
    await (await getClient()).SET(key, JSON.stringify(data));
    return;
  };

  return { save, load, reset };
}

export function createEventStore<E>() {
  const append: AppendEvent<E> = (key) => (event: E) => {
    if (!event) throw new Error("event not defined");
    console.log(key);
    //TODO
    return Promise.resolve();
  };

  const stream: StreamEvents<E> = (key) => (callback) => {
    //TODO
    console.log(key, callback);
    return Promise.resolve();
  };

  return { append, stream };
}
