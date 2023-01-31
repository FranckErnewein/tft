import { FC } from "react";
import { Game, RoundResult } from "../state";

interface Props {
  game: Game;
}

const Bets: FC<Props> = ({ game }) => {
  return (
    <div>
      {game.currentRound &&
        Object.keys(game.currentRound.bets).map((playerId) => {
          const player = game.players[playerId];
          const bet = game.currentRound?.bets[playerId];
          if (!player || !bet) return null;
          return (
            <div>
              {player.name} :{" "}
              {bet.expectedResult === RoundResult.WIN ? "win" : "lose"} for{" "}
              {bet.amountCents / 100} €
            </div>
          );
        })}
    </div>
  );
};

export default Bets;
