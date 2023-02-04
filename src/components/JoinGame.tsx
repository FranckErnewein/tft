import { FC, useState, ChangeEvent } from "react";
import { Navigate } from "react-router-dom";

import { PlayerJoined } from "../events";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import playerJoin, {
  Options as PlayerJoinOptions,
} from "../commands/playerJoin";
import createCommandButton from "./createCommandButton";

const PlayerJoinButton = createCommandButton<PlayerJoinOptions, PlayerJoined>(
  playerJoin
);

const JoinGame: FC = () => {
  const [playerName, setPlayerName] = useState<string>("");
  const [playerId, setPlayerId] = useState<string | null>(null);

  if (playerId) {
    return <Navigate to={`player/${playerId}`} />;
  }

  return (
    <Box textAlign="center">
      <TextField
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
      >
        Join party
      </PlayerJoinButton>
    </Box>
  );
};

export default JoinGame;
