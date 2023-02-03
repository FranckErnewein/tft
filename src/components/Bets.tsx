import { FC } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import { Game, RoundResult, Player } from "../state";

interface Props {
  game: Game;
}

const Bets: FC<Props> = ({ game }) => {
  return (
    <Box>
      {game.currentRound &&
        Object.values(game.players).map((player: Player) => {
          const firstNameLetter = player.name[0] || "X";
          const bet = game.currentRound?.bets[player.id];
          return (
            <Stack
              key={player.id}
              spacing={2}
              direction="row"
              sx={{ mb: 1 }}
              alignItems="center"
            >
              <Tooltip title={player.name} placement="left">
                <Avatar alt={player.name}>{firstNameLetter}</Avatar>
              </Tooltip>
            </Stack>
          );
        })}
    </Box>
  );
};

export default Bets;
