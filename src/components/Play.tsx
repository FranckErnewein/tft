import { FC, useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Game, RoundResult, RoundStatus } from "../state";
import { useCommand } from "../hooks";
import { PlayerBet } from "../events";
import playerBet, { Options as PlayerBetOptions } from "../commands/playerBet";
import Bets from "./Bets";
import RoundHistory from "./RoundHistory";

interface Props {
  game: Game;
}

const Play: FC<Props> = ({ game }) => {
  const { mutate: bet } = useCommand<PlayerBetOptions, PlayerBet>(playerBet);
  const navigate = useNavigate();
  const [sliderValues, setSliderValues] = useState<number[]>([0, 0]);
  const increaseValue = (incr: number) =>
    setSliderValues([sliderValues[0] + incr, 0]);
  const { playerId } = useParams();
  const player = playerId ? game.players[playerId] : null;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    if (!player) {
      timeout = setTimeout(() => {
        if (!player) navigate("/");
      }, 5000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [player]);

  if (!playerId) return <Navigate to="/" />;
  if (!player) {
    return (
      <Box textAlign="center" p={10}>
        <CircularProgress />
      </Box>
    );
  }

  const betOptions: PlayerBetOptions = {
    amountCents: Math.abs(sliderValues[0]),
    forecast: sliderValues[0] > 0 ? RoundResult.WIN : RoundResult.LOSE,
    playerId,
  };
  const color =
    betOptions.forecast === RoundResult.WIN ? "primary" : "secondary";
  const isBetTime = game.currentRound?.status === RoundStatus.BET_TIME;
  const marks = [...Array(21).keys()].map((i) => {
    return {
      value: i * 100 - 1000,
      label: Math.abs(i - 10) + "€",
    };
  });

  return (
    <>
      <Box textAlign="center">
        <Grid container>
          <Grid item xs={2} textAlign="left">
            <RoundHistory game={game} />
          </Grid>
          <Grid item xs={8} textAlign="center">
            <Typography variant="caption">your balance</Typography>
            <Typography variant="h4">{player.balanceCents / 100}€</Typography>
          </Grid>
        </Grid>
        <br />
        <br />
        <Box>
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
            disabled={!isBetTime}
            min={-500}
            step={5}
            marks={marks}
            max={500}
          />
        </Box>
        <Grid container>
          <Grid item xs={5} textAlign="left">
            <ButtonGroup
              variant="outlined"
              color="secondary"
              disabled={!isBetTime}
            >
              <Button onClick={() => increaseValue(-100)}>+1€</Button>
              <Button onClick={() => increaseValue(-50)}>+0.50€</Button>
              <Button onClick={() => increaseValue(-10)}>+0.10€</Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={2} textAlign="center">
            <Button
              variant="outlined"
              onClick={() => setSliderValues([0, 0])}
              disabled={!isBetTime}
            >
              Reset 0€
            </Button>
          </Grid>
          <Grid item xs={5} textAlign="right">
            <ButtonGroup
              variant="outlined"
              color="primary"
              disabled={!isBetTime}
            >
              <Button onClick={() => increaseValue(10)}>+0.10€</Button>
              <Button onClick={() => increaseValue(50)}>+0.50€</Button>
              <Button onClick={() => increaseValue(100)}>+1€</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
        {isBetTime && (
          <Box mt={3}>
            <Button
              variant="contained"
              color={color}
              disabled={betOptions.amountCents === 0}
              onClick={() => bet(betOptions)}
            >
              Bet
            </Button>
          </Box>
        )}
        {!isBetTime && game.currentRound && (
          <Typography variant="overline">Fighting now</Typography>
        )}
        {!isBetTime && !game.currentRound && (
          <Typography variant="overline">Waiting for next round</Typography>
        )}
      </Box>
      <Bets game={game} />
    </>
  );
};

export default Play;
