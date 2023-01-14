import { FC, useRef, useState } from "react";
import { Game } from "../state";
import { useCommand } from "../hooks";
import { PlayerJoined } from "../events";
import {
  startGame,
  StartGameOptions,
  playerJoin,
  PlayerJoinOptions,
} from "../commands";

const Admin: FC<Game> = (game) => {
  const startGameMutation = useCommand<StartGameOptions>(startGame);
  const playerJoinMutation = useCommand<PlayerJoinOptions, PlayerJoined>(
    playerJoin
  );
  const inputPlayerName = useRef<HTMLInputElement>(null);
  console.log("render");
  console.log("player join event", playerJoinMutation.data);
  return (
    <div>
      <h2>Admin</h2>
      <hr />
      <button
        onClick={() => startGameMutation.mutate({})}
        disabled={startGameMutation.isLoading}
      >
        {game.id ? "reset game" : "start game"}
      </button>
      <hr />
      {game.id && (
        <div>
          <button
            onClick={() => {
              if (inputPlayerName.current) {
                playerJoinMutation.mutate({
                  playerName: inputPlayerName.current.value,
                });
              }
            }}
            disabled={playerJoinMutation.isLoading}
          >
            add player
          </button>
          <input ref={inputPlayerName} />
        </div>
      )}
    </div>
  );
};

export default Admin;
