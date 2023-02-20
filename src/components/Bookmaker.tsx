import { FC } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import { Game, RoundStatus } from "../state";
import createCommandButton from "./createCommandButton";
import startGame from "../commands/startGame";
import PlayerList from "./PlayerList";
import ScheduleEndBetAction from "./bookmaker/ScheduleEndBetAction";
import StartNewRoundAction from "./bookmaker/StartNewRoundAction";
import EndRoundAction from "./bookmaker/EndRoundAction";

const StartGameButton = createCommandButton(startGame);

const Bookmaker: FC<Game> = (game) => {
  let status = "";
  let action = null;
  if (!game.id) {
    status = "No game. Create a new one.";
    action = <StartGameButton>Start a new game</StartGameButton>;
  } else if (!game.currentRound) {
    status = "Waiting for new round.";
    action = <StartNewRoundAction />;
  } else if (game.currentRound.status === RoundStatus.BET_TIME) {
    status = "Player are betting... ";
    if (game.currentRound.betEndTimer && game.currentRound.betEndTimer > 0)
      status += `finish in ${Math.round(
        game.currentRound.betEndTimer / 1000
      )}s`;
    const disabled =
      typeof game.currentRound.betEndTimer === "number" &&
      game.currentRound.betEndTimer > 0;
    action = <ScheduleEndBetAction disabled={disabled} />;
  } else if (game.currentRound.status === RoundStatus.RUNNING) {
    status = "Bet time over. time to close the bet.";
    action = <EndRoundAction {...game.currentRound} />;
  }
  return (
    <>
      <Box>
        <Typography variant="h3">Bookmaker</Typography>
      </Box>
      <Paper>
        <Box p={3}>
          <Grid container>
            <Grid item xs={6}>
              {game.currentRound && (
                <Typography variant="h5">
                  Round n°{game.pastRounds.length + 1}
                </Typography>
              )}
              <br />
              <Typography variant="body1">{status}</Typography>
              <br />
              <Box>{action}</Box>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={4}>
              <PlayerList players={game.players} />
            </Grid>
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

export default Bookmaker;
