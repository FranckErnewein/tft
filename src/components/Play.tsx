import { FC, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Slider from "@mui/material/Slider";
import { Game, RoundResult } from "../state";
import { useCommand } from "../hooks";
import { PlayerLeft, PlayerBet } from "../events";
import playerLeave, {
  Options as PlayerLeaveOptions,
} from "../commands/playerLeave";
import playerBet, { Options as PlayerBetOptions } from "../commands/playerBet";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
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
  const [sliderValues, setSliderValues] = useState<number[]>([0, 0]);
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
            <Slider
              valueLabelDisplay="on"
              value={sliderValues}
              onChange={(_, v: number | number[], a: number) => {
                if (typeof v !== "number")
                  setSliderValues(a === 0 ? [v[0], 0] : [v[1], 0]);
              }}
              valueLabelFormat={(value: number) => {
                if (value > 0) return `win for ${value / 100}€`;
                if (value < 0) return `lose for ${-value / 100}€`;
                return "0";
              }}
              min={-1000}
              max={1000}
            />
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
