import { FC } from "react";
import { useParams, Link } from "react-router-dom";
import { Game } from "../state";
import { useCommand } from "../hooks";
import { PlayerLeft } from "../events";
import { playerLeave, PlayerLeaveOptions } from "../commands";

export interface Props {
  game: Game;
}

const Play: FC<Props> = ({ game }) => {
  const playerLeaveMutation = useCommand<PlayerLeaveOptions, PlayerLeft>(
    playerLeave
  );
  const { playerId } = useParams();
  if (!playerId) return null;
  const player = game.players[playerId];

  return (
    <div>
      <Link
        to="/"
        onClick={() => {
          playerLeaveMutation.mutate({ playerId });
        }}
      >
        Quit
      </Link>
      <hr />
      {player && (
        <div>
          {player.name} - {player.balanceCents / 100}€
        </div>
      )}
    </div>
  );
};

export default Play;
