import { FC, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Game, RoundResult } from "../state";
import { useCommand } from "../hooks";
import { PlayerLeft, PlayerBet } from "../events";
import playerLeave, {
  Options as PlayerLeaveOptions,
} from "../commands/playerLeave";
import playerBet, { Options as PlayerBetOptions } from "../commands/playerBet";
import Bets from "./Bets";

export interface Props {
  game: Game;
}

const Play: FC<Props> = ({ game }) => {
  const { mutate: leave } = useCommand<PlayerLeaveOptions, PlayerLeft>(
    playerLeave
  );
  const { mutate: bet } = useCommand<PlayerBetOptions, PlayerBet>(playerBet);
  const [amountCents, setAmountCents] = useState<number>(10);
  const [win, setWin] = useState<boolean>(true);
  const { playerId } = useParams();
  if (!playerId) return null;
  const player = game.players[playerId];

  return (
    <div>
      {player && (
        <div>
          {player.name} - {(player.balanceCents - amountCents) / 100}€
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              if (game.currentRound)
                bet({
                  amountCents,
                  forecast: win ? RoundResult.WIN : RoundResult.LOSE,
                  playerId,
                });
            }}
          >
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              defaultValue={amountCents}
              onChange={(e) =>
                setAmountCents(parseInt(e.currentTarget.value, 10))
              }
            />
            {amountCents / 100}€
            <br />
            <label>
              <input
                type="radio"
                name="win-lose"
                value="win"
                onChange={() => setWin(true)}
                defaultChecked
              />
              win
            </label>
            <label>
              <input
                type="radio"
                name="win-lose"
                value="lose"
                onChange={() => setWin(false)}
              />
              lose
            </label>
            <br />
            <br />
            <input
              type="submit"
              value="Bet"
              disabled={game.currentRound === null}
              title={
                game.currentRound === null ? "wait for next round to bet" : ""
              }
            />
          </form>
          <hr />
          <Bets game={game} />
          <hr />
          <Link to="/" onClick={() => leave({ playerId })}>
            Quit
          </Link>
        </div>
      )}
    </div>
  );
};

export default Play;
