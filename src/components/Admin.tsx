import { FC } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import { Game, RoundStatus, RoundResult } from "../state";
import createCommandButton from "./createCommandButton";
import startGame from "../commands/startGame";
import startRound from "../commands/startRound";
import scheduleEndBet, {
  Options as SEBOptions,
} from "../commands/scheduleEndBet";
import endRound from "../commands/endRound";

const StartGameButton = createCommandButton(startGame);
const StartRoundButton = createCommandButton(startRound);
const ScheduleEndBetButton = createCommandButton<SEBOptions>(scheduleEndBet);
const EndRoundButton = createCommandButton(endRound);

const Admin: FC<Game> = (game) => {
  let status = "";
  let action = null;
  if (!game.id) {
    status = "No game. Create a new one.";
    action = <StartGameButton>Start a new game</StartGameButton>;
  } else if (!game.currentRound) {
    status = "Waiting for new round.";
    action = <StartRoundButton>Start a new round</StartRoundButton>;
  } else if (game.currentRound.status === RoundStatus.BET_TIME) {
    status = "Player are betting... ";
    if (game.currentRound.betEndTimer && game.currentRound.betEndTimer > 0)
      status += `finish in ${Math.round(
        game.currentRound.betEndTimer / 1000
      )}s`;
    action = (
      <ScheduleEndBetButton
        options={{ restTime: 5000, interval: 1000 }}
        disabled={
          typeof game.currentRound.betEndTimer === "number" &&
          game.currentRound.betEndTimer > 0
        }
      >
        End bets in 5s
      </ScheduleEndBetButton>
    );
  } else if (game.currentRound.status === RoundStatus.RUNNING) {
    status = "Bet time over. how did it end ?";
    action = (
      <>
        <Grid item xs={2}>
          <EndRoundButton
            color="secondary"
            options={{ roundResult: RoundResult.LOSE }}
          >
            Round lost
          </EndRoundButton>
        </Grid>
        <Grid item xs={2}>
          <EndRoundButton options={{ roundResult: RoundResult.WIN }}>
            Round won
          </EndRoundButton>
        </Grid>
      </>
    );
  }
  return (
    <>
      <Box>
        <Typography variant="h3">Admin</Typography>
      </Box>
      <Paper>
        <Box p={3}>
          {game.currentRound && (
            <Typography variant="h5">
              Round n°{game.pastRounds.length + 1}
            </Typography>
          )}
          <Typography variant="body1">{status}</Typography>
          <Grid container mt={3}>
            {action}
          </Grid>
        </Box>
      </Paper>
      {game.id && (
        <Box p={3} textAlign="right">
          <StartGameButton color="error">Reset this game</StartGameButton>
        </Box>
      )}
    </>
  );
};

export default Admin;
