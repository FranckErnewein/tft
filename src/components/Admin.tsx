import { FC } from "react";
import { Game, RoundStatus, RoundResult } from "../state";
import createCommandButton from "./createCommandButton";
import startGame from "../commands/startGame";
import startRound from "../commands/startRound";
import endBet from "../commands/endBet";
import endRound from "../commands/endRound";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const StartGameButton = createCommandButton(startGame);
const StartRoundButton = createCommandButton(startRound);
const EndBetButton = createCommandButton(endBet);
const EndRoundButton = createCommandButton(endRound);

const Admin: FC<Game> = (game) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography>Admin</Typography>
      </Grid>
      <Grid item xs={4}>
        <StartGameButton>
          {game.id ? "reset game" : "start game"}
        </StartGameButton>
      </Grid>
      {game.id && !game.currentRound && (
        <Grid item xs={4}>
          <StartRoundButton>Start a new round</StartRoundButton>
        </Grid>
      )}
      {game.currentRound && game.currentRound?.status === RoundStatus.BET_TIME && (
        <Grid item xs={4}>
          <EndBetButton>End betting time</EndBetButton>
        </Grid>
      )}
      {game.currentRound && game.currentRound?.status === RoundStatus.RUNNING && (
        <>
          <Grid item xs={2}>
            <EndRoundButton options={{ roundResult: RoundResult.WIN }}>
              Round won
            </EndRoundButton>
          </Grid>
          <Grid item xs={2}>
            <EndRoundButton options={{ roundResult: RoundResult.LOSE }}>
              Round lost
            </EndRoundButton>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Admin;
