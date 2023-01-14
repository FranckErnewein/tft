import { FC } from "react";
import { useParams } from "react-router-dom";
import { Game } from "../state";

export interface Props {
  game: Game;
}

const Play: FC<Props> = ({ game }) => {
  const { playerId } = useParams();
  if (playerId == null) return null;
  const player = game.players[playerId];
  if (!player) return null;

  return (
    <div>
      {player.name} - {player.balanceCents / 100}€
    </div>
  );
};

export default Play;
