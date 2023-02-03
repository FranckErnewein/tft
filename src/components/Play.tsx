import { FC, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
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
  const [sliderValues, setSliderValues] = useState<number[]>([0, 0]);
  const { playerId } = useParams();
  if (!playerId) return null;
  const player = game.players[playerId];

  return (
    <div>
      {player && (
        <div>
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
