import { FC } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

import { Game, Player, RoundStatus, RoundResult } from "../state";
import { displayAmount } from "../utils";
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

const Bookmaker: FC<Game> = (game) => {
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
    const disabled =
      typeof game.currentRound.betEndTimer === "number" &&
      game.currentRound.betEndTimer > 0;
    action = (
      <Typography>
        <ScheduleEndBetButton
          options={{ restTime: 5000, interval: 1000 }}
          disabled={disabled}
        >
          End bets in 5s
        </ScheduleEndBetButton>
        <ScheduleEndBetButton
          options={{ restTime: 30000, interval: 1000 }}
          disabled={disabled}
        >
          End bets in 30s
        </ScheduleEndBetButton>
      </Typography>
    );
  } else if (game.currentRound.status === RoundStatus.RUNNING) {
    status = "Bet time over. how did it end ?";
    action = (
      <>
        <EndRoundButton
          color="secondary"
          options={{ roundResult: RoundResult.LOSE }}
        >
          Round lost
        </EndRoundButton>
        <EndRoundButton options={{ roundResult: RoundResult.WIN }}>
          Round won
        </EndRoundButton>
      </>
    );
  }
  return (
    <>
      <Box>
        <Typography variant="h3">Bookmaker</Typography>
      </Box>
      <Paper>
        <Box p={3}>
          <Grid container>
            <Grid item xs={4}>
              {game.currentRound && (
                <Typography variant="h5">
                  Round n°{game.pastRounds.length + 1}
                </Typography>
              )}
              <br />
              <Typography variant="body1">{status}</Typography>
              <br />
              <Box display="flex" justifyContent="space-between">
                {action}
              </Box>
            </Grid>
            <Grid item xs={4} />
            <Grid item xs={4}>
              <List>
                {Object.values(game.players).map((player: Player) => {
                  return (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>{player.name[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={player.name}
                        secondary={displayAmount(player.balanceCents)}
                      />
                    </ListItem>
                  );
                })}
              </List>
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
