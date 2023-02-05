import { FC } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { Game } from "../state";
import createCommandButton from "./createCommandButton";
import playerLeave from "../commands/playerLeave";

const LeaveButton = createCommandButton(playerLeave);

interface Props {
  game: Game;
}

const PlayerMenu: FC<Props> = ({ game }) => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  if (!playerId) return null;
  const player = game.players[playerId];
  if (!player)
    return (
      <Link to="/">
        <Typography>Home</Typography>
      </Link>
    );

  return (
    <Box mt={1}>
      <Typography variant="overline">
        {player.name} - {player.balanceCents / 100}€ -
        <LeaveButton
          color="primary"
          options={{ playerId }}
          onSuccess={() => {
            //FIX ME
            navigate("/");
          }}
        >
          Quit
        </LeaveButton>
      </Typography>
    </Box>
  );
};

export default PlayerMenu;
