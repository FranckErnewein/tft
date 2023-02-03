import { FC, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
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
  const [sliderValues, setSliderValues] = useState<number[]>([0, 0]);
  const { playerId } = useParams();
  if (!playerId) return null;
  const player = game.players[playerId];
  const betOptions: PlayerBetOptions = {
    amountCents: Math.abs(sliderValues[0]),
    forecast: sliderValues[0] > 0 ? RoundResult.WIN : RoundResult.LOSE,
    playerId,
  };
  const color =
    betOptions.forecast === RoundResult.WIN ? "primary" : "secondary";

  return (
    <div>
      {player && (
        <div>
          <Box textAlign="center">
            <Slider
              valueLabelDisplay="on"
              value={sliderValues}
              color={color}
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
            <Button
              variant="contained"
              color={color}
              disabled={betOptions.amountCents === 0}
              onClick={() => bet(betOptions)}
            >
              Bet
            </Button>
          </Box>
          <Bets game={game} />
          <Link to="/" onClick={() => leave({ playerId })}>
            <Button>Quit</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Play;
