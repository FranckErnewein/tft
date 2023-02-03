import { FC, useState, ChangeEvent } from "react";
import { Navigate } from "react-router-dom";

import { useCommand } from "../hooks";
import { PlayerJoined } from "../events";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import playerJoin, {
  Options as PlayerJoinOptions,
} from "../commands/playerJoin";

const JoinGame: FC = () => {
  const playerJoinMutation = useCommand<PlayerJoinOptions, PlayerJoined>(
    playerJoin
  );
  const [playerName, setPlayerName] = useState<string>("");

  const playerId = playerJoinMutation.data?.payload.player.id;
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
      <Button
        variant="contained"
        onClick={() => playerJoinMutation.mutate({ playerName })}
      >
        Join party
      </Button>
    </Box>
  );
};

export default JoinGame;
