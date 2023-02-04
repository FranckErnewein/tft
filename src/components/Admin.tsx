import { FC } from "react";
import { Game, RoundStatus, RoundResult } from "../state";
import { useCommand } from "../hooks";
import startGame from "../commands/startGame";
import startRound from "../commands/startRound";
import endBet from "../commands/endBet";
import endRound from "../commands/endRound";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const Admin: FC<Game> = (game) => {
  const startGameMutation = useCommand(startGame);
  const startRoundMutation = useCommand(startRound);
  const endBetMutation = useCommand(endBet);
  const endRoundMutation = useCommand(endRound);
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography>Admin</Typography>
      </Grid>
      <Grid item xs={4}>
        <Button
          variant="outlined"
          onClick={() => startGameMutation.mutate({})}
          disabled={startGameMutation.isLoading}
        >
          {game.id ? "reset game" : "start game"}
        </Button>
      </Grid>
      {game.id && !game.currentRound && (
        <Grid item xs={4}>
          <Button
            variant="outlined"
            onClick={() => {
              startRoundMutation.mutate({});
            }}
            disabled={startRoundMutation.isLoading}
          >
            start a new round
          </Button>
        </Grid>
      )}
      {game.currentRound && game.currentRound?.status === RoundStatus.BET_TIME && (
        <Grid item xs={4}>
          <Button
            variant="outlined"
            onClick={() => {
              endBetMutation.mutate({});
            }}
            disabled={endBetMutation.isLoading}
          >
            end bet
          </Button>
        </Grid>
      )}
      {game.currentRound && game.currentRound?.status === RoundStatus.RUNNING && (
        <>
          <Grid item xs={2}>
            <Button
              variant="contained"
              onClick={() => {
                endRoundMutation.mutate({ roundResult: RoundResult.WIN });
              }}
              disabled={endRoundMutation.isLoading}
            >
              Round won
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                endRoundMutation.mutate({ roundResult: RoundResult.LOSE });
              }}
              disabled={endRoundMutation.isLoading}
            >
              Round Lost
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Admin;
