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
import { displayAmount } from "../utils";
import { useCommand } from "../hooks";
import { PlayerBet, PlayerCancelBet } from "../events";
import playerBet, { Options as PlayerBetOptions } from "../commands/playerBet";
import playerCancelBet, {
  Options as PlayerCancelBetOptions,
} from "../commands/playerCancelBet";
import Bets from "./Bets";
import RoundHistoryPanel from "./RoundHistoryPanel";
import PlayerListPanel from "./PlayerListPanel";

interface Props {
  game: Game;
}

const Play: FC<Props> = ({ game }) => {
  const { currentRound, players } = game;
  const { mutate: bet } = useCommand<PlayerBetOptions, PlayerBet>(playerBet);
  const { mutate: cancel } = useCommand<
    PlayerCancelBetOptions,
    PlayerCancelBet
  >(playerCancelBet);
  const navigate = useNavigate();
  const [sliderValues, setSliderValues] = useState<number[]>([0, 0]);
  const increaseValue = (incr: number) =>
    setSliderValues([sliderValues[0] + incr, 0]);
  const { playerId } = useParams();
  const player = playerId ? players[playerId] : null;
  const forecast =
    sliderValues[0] > 0 ? RoundResult.ANSWER_A : RoundResult.ANSWER_B;

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

  useEffect(() => {
    if (playerId) {
      const [value] = sliderValues;
      value === 0
        ? cancel({ playerId })
        : bet({ forecast, playerId, amountCents: Math.abs(sliderValues[0]) });
    }
  }, [sliderValues]);

  if (!playerId) return <Navigate to="/" />;
  if (!player) {
    return (
      <Box textAlign="center" p={10}>
        <CircularProgress />
      </Box>
    );
  }

  const color = forecast === RoundResult.ANSWER_A ? "primary" : "secondary";
  const isBetTime = currentRound?.status === RoundStatus.BET_TIME;
  const marks = [...Array(21).keys()].map((i) => {
    return {
      value: i * 100 - 1000,
      label: displayAmount(Math.abs(i - 10)),
    };
  });

  return (
    <>
      <Box textAlign="center">
        <Grid container>
          <Grid item xs={2} textAlign="left">
            <RoundHistoryPanel game={game} />
          </Grid>
          <Grid item xs={8} textAlign="center">
            <Typography variant="caption">your balance</Typography>
            <Typography variant="h4">
              {displayAmount(player.balanceCents)}
            </Typography>
          </Grid>
          <Grid item xs={2} textAlign="right">
            <PlayerListPanel game={game} />
          </Grid>
        </Grid>
        {currentRound && (
          <Grid container>
            <Grid item xs={12} textAlign="center">
              <Typography variant="h6" textAlign="center">
                {currentRound.question}
              </Typography>
            </Grid>
            <Grid item xs={5} textAlign="right">
              <Typography variant="h6" color="secondary">
                {currentRound.answerB}
              </Typography>
            </Grid>
            <Grid item xs={2} textAlign="center">
              <Typography variant="h6">OR</Typography>
            </Grid>
            <Grid item xs={5} textAlign="left">
              <Typography variant="h6" color="primary">
                {currentRound.answerA}
              </Typography>
            </Grid>
          </Grid>
        )}
        <br />
        <br />
        <Box>
          <Slider
            valueLabelDisplay={currentRound ? "on" : "off"}
            value={currentRound ? sliderValues : [0, 0]}
            color={color}
            onChange={(_, v: number | number[], a: number) => {
              if (typeof v !== "number")
                setSliderValues(a === 0 ? [v[0], 0] : [v[1], 0]);
            }}
            valueLabelFormat={(value: number) => {
              if (!currentRound) return "";
              if (value > 0)
                return `${displayAmount(value)} for ${currentRound.answerA}`;
              if (value < 0)
                return `${displayAmount(-value)} for ${currentRound.answerB}`;
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
        {!isBetTime && currentRound && (
          <Typography variant="overline">Fighting now</Typography>
        )}
        {!isBetTime && !currentRound && (
          <Typography variant="overline">Waiting for next round</Typography>
        )}
      </Box>
      <Bets game={game} />
    </>
  );
};

export default Play;
