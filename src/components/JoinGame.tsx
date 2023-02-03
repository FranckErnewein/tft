import { FC, useRef } from "react";
import { Navigate } from "react-router-dom";

import { useCommand } from "../hooks";
import { PlayerJoined } from "../events";
import playerJoin, {
  Options as PlayerJoinOptions,
} from "../commands/playerJoin";

const JoinGame: FC = () => {
  const playerJoinMutation = useCommand<PlayerJoinOptions, PlayerJoined>(
    playerJoin
  );
  const inputPlayerName = useRef<HTMLInputElement>(null);

  const playerId = playerJoinMutation.data?.payload.player.id;
  if (playerId) {
    return <Navigate to={`player/${playerId}`} />;
  }

  return (
    <form
      action=""
      onSubmit={(e) => {
        e.preventDefault();
        if (
          inputPlayerName.current &&
          inputPlayerName.current.value.length > 1
        ) {
          playerJoinMutation.mutate({
            playerName: inputPlayerName.current?.value,
          });
        }
      }}
    >
      <input type="text" ref={inputPlayerName} />
      <input type="submit" value="join game" />
    </form>
  );
};

export default JoinGame;
