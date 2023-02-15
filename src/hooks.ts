import { useEffect, useState } from "react";
import { useQuery, useMutation, UseMutateFunction } from "react-query";
import io from "socket.io-client";
import reducer from "./reducer";
import { EMPTY_GAME, Game } from "./state";
import { Command, AsyncCommand, DefaultOption } from "./commands/types";
import { GameEvent, BaseEvent } from "./events";
import { SerializedError } from "./errors";

const apiUrl = import.meta.env.VITE_API_URL || "";

export function useGame(): Game {
  const [gameState, setGameState] = useState<Game>(EMPTY_GAME);
  const [gameLoaded, setGameLoaded] = useState<boolean>(false);
  useQuery({
    queryKey: "state",
    queryFn: () =>
      fetch(`${apiUrl}/state`).then((r) => r.json()) as Promise<Game>,
    onSuccess: (data) => {
      setGameLoaded(true);
      setGameState(data);
    },
    enabled: !gameLoaded,
  });

  useEffect(() => {
    if (gameLoaded) {
      const socket = io(apiUrl);
      let state: Game = gameState;
      socket.on("gameEvent", (event) => {
        state = reducer(state, event);
        setGameState(state);
      });
      return () => {
        socket.close();
      };
    }
  }, [gameLoaded]);
  return gameState;
}
export type CommandResponsePayload<E = GameEvent> =
  | { type: "event"; event: E }
  | { type: "error"; error: SerializedError }
  | { type: "async" };

export interface UseCommand<O, E> {
  data: E | null;
  error: SerializedError | null;
  isLoading: boolean;
  mutate: UseMutateFunction<CommandResponsePayload<E>, unknown, O>;
}

export function useCommand<
  O extends DefaultOption = {},
  E extends BaseEvent = GameEvent
>(
  command: Command<O> | AsyncCommand<O, E>,
  mutationOptions?: { onSuccess?: (json: CommandResponsePayload<E>) => void }
): UseCommand<O, E> {
  const { data, isLoading, mutate } = useMutation<
    CommandResponsePayload<E>,
    unknown,
    O
  >(async (options: O) => {
    return fetch(`${apiUrl}/commands/${command.name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    }).then((r) => r.json());
  }, mutationOptions);
  return {
    data: data?.type === "event" ? data.event : null,
    error: data?.type === "error" ? data.error : null,
    isLoading,
    mutate,
  };
}
