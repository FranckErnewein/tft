import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import io from "socket.io-client";
import reducer from "./reducer";
import { EMPTY_GAME, Game } from "./state";

export function useGame(): Game {
  const [gameState, setGameState] = useState<Game>(EMPTY_GAME);
  const { data: stateOnLoad } = useQuery({
    queryKey: "state",
    queryFn: () =>
      fetch("http://localhost:3000/state").then((r) =>
        r.json()
      ) as Promise<Game>,
  });
  useEffect(() => {
    if (stateOnLoad && stateOnLoad.id) {
      setGameState(stateOnLoad);
      const socket = io("http://localhost:3000/");
      socket.on("gameEvent", (event) => {
        setGameState(reducer(gameState, event));
      });
      return () => {
        socket.close();
      };
    }
  }, [stateOnLoad]);
  return gameState;
}
