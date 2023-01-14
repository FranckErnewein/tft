import { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import io from "socket.io-client";
import reducer from "./reducer";
import { EMPTY_GAME, Game } from "./state";
import { Command, AbstractOptions } from "./commands";
import { AbstractEvent } from "./events";

export function useGame(): Game {
  const [gameState, setGameState] = useState<Game>(EMPTY_GAME);
  const [gameLoaded, setGameLoaded] = useState<boolean>(false);
  useQuery({
    queryKey: "state",
    queryFn: () =>
      fetch("http://localhost:3000/state").then((r) =>
        r.json()
      ) as Promise<Game>,
    onSuccess: (data) => {
      setGameLoaded(true);
      setGameState(data);
    },
  });

  useEffect(() => {
    if (gameLoaded) {
      const socket = io("http://localhost:3000/");
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

export function useCommand<O extends AbstractOptions = {}, E = AbstractEvent>(
  command: Command<AbstractEvent, O>
) {
  return useMutation<E, unknown, O>((options) => {
    return fetch(`http://localhost:3000/commands/${command.name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    }).then((r) => r.json());
  });
}
