import { FC, useRef } from "react";
import { Game } from "../state";
import { useCommand } from "../hooks";
import { PlayerJoined, RoundStarted } from "../events";
import {
  startGame,
  StartGameOptions,
  playerJoin,
  PlayerJoinOptions,
  startRound,
  StartRoundOptions,
} from "../commands";

const Admin: FC<Game> = (game) => {
  const startGameMutation = useCommand<StartGameOptions>(startGame);
  const playerJoinMutation = useCommand<PlayerJoinOptions, PlayerJoined>(
    playerJoin
  );
  const startRoundMutation = useCommand<StartRoundOptions, RoundStarted>(
    startRound
  );
  const inputPlayerName = useRef<HTMLInputElement>(null);
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
          <hr />
          <button
            onClick={() => {
              startRoundMutation.mutate({});
            }}
            disabled={startRoundMutation.isLoading}
          >
            start a new round
          </button>
        </div>
      )}
    </div>
  );
};

export default Admin;
