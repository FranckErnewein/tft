import { FC } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { Game } from "../state";
import { PlayerLeft } from "../events";
import createCommandButton from "./createCommandButton";
import playerLeave, {
  Options as PlayerLeaveOptions,
} from "../commands/playerLeave";

const LeaveButton = createCommandButton<PlayerLeaveOptions, PlayerLeft>(
  playerLeave
);

interface Props {
  game: Game;
}

const PlayerMenu: FC<Props> = ({ game }) => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  if (!playerId) return null;
  const player = game.players[playerId];
  if (!player) return null;

  return (
    <Box mt={1}>
      <Typography variant="overline">
        <Button startIcon={<AccountCircleIcon />} color="inherit">
          {player.name} - {player.balanceCents / 100}€
        </Button>
        <LeaveButton
          options={{ playerId }}
          icon={<ExitToAppIcon />}
          onSuccess={() => {
            navigate("/");
          }}
        >
          Leave
        </LeaveButton>
      </Typography>
    </Box>
  );
};

export default PlayerMenu;
