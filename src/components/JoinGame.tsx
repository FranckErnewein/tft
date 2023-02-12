import { FC, useState, ChangeEvent } from "react";
import { Navigate } from "react-router-dom";

import { PlayerJoined } from "../events";
import { Game } from "../state";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";

import playerJoin, {
  Options as PlayerJoinOptions,
} from "../commands/playerJoin";
import createCommandButton from "./createCommandButton";

const PlayerJoinButton = createCommandButton<PlayerJoinOptions, PlayerJoined>(
  playerJoin
);

interface Props {
  game: Game;
}

const JoinGame: FC<Props> = ({ game }) => {
  const [playerName, setPlayerName] = useState<string>("");
  const [playerId, setPlayerId] = useState<string | null>(null);

  if (playerId) {
    return <Navigate to={`player/${playerId}`} />;
  }

  return (
    <Box textAlign="center">
      <Grid container>
        <Grid item xs={4} />
        <Grid item xs={4}>
          {!game.id && (
            <Alert severity="warning">No game now. Wait for a new game</Alert>
          )}
          {game.id && (
            <Alert severity="success">Game Started, you can join</Alert>
          )}
          <br />
          <TextField
            fullWidth
            label="Your name"
            variant="outlined"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPlayerName(e.target.value)
            }
          />
          <br />
          <br />
          <PlayerJoinButton
            options={{ playerName }}
            onSuccess={(event: PlayerJoined) => {
              setPlayerId(event.payload.player.id);
            }}
            disabled={!game.id}
          >
            Join party
          </PlayerJoinButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JoinGame;
