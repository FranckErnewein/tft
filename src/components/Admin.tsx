import { FC, useRef } from "react";
import { Game } from "../state";
import { useCommand } from "../hooks";
import { PlayerJoined } from "../events";
import startGame from "../commands/startGame";
import playerJoin, {
  Options as PlayerJoinOptions,
} from "../commands/playerJoin";
import startRound from "../commands/startRound";

const Admin: FC<Game> = (game) => {
  const startGameMutation = useCommand(startGame);
  const playerJoinMutation = useCommand<PlayerJoinOptions, PlayerJoined>(
    playerJoin
  );
  const startRoundMutation = useCommand(startRound);
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
