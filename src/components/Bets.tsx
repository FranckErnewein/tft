import { FC } from "react";
import Avatar from "@mui/material/Avatar";
import { Game, RoundResult, Player } from "../state";

interface Props {
  game: Game;
}

const Bets: FC<Props> = ({ game }) => {
  return (
    <div>
      {game.currentRound &&
        Object.values(game.players).map((player: Player) => {
          const firstNameLetter = player.name[0] || "X";
          const bet = game.currentRound?.bets[player.id];
          return (
            <div key={player.id}>
              <Avatar>{firstNameLetter}</Avatar>
            </div>
          );
        })}
    </div>
  );
};

export default Bets;
