import { FC, useRef } from "react";
import { Game } from "../state";
import { useCommand } from "../hooks";
import {
  startGame,
  StartGameOptions,
  playerJoin,
  PlayerJoinOptions,
} from "../commands";

const Admin: FC<Game> = (game) => {
  const execStartGame = useCommand<StartGameOptions>(startGame);
  const execPlayerJoin = useCommand<PlayerJoinOptions>(playerJoin);
  const inputPlayerName = useRef<HTMLInputElement>(null);
  return (
    <div>
      <h2>Admin</h2>
      <hr />
      <button
        onClick={() => execStartGame.mutate({})}
        disabled={execStartGame.isLoading}
      >
        {game.id ? "reset game" : "start game"}
      </button>
      <hr />
      {game.id && (
        <div>
          <button
            onClick={() => {
              if (inputPlayerName.current) {
                execPlayerJoin.mutate({
                  playerName: inputPlayerName.current.value,
                });
              }
            }}
            disabled={execPlayerJoin.isLoading}
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
