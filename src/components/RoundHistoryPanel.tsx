import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import { roundResultForPlayer } from "../round/queries";
import { displayAmount } from "../utils";
import { Game, Round, Bet } from "../state";

interface Props {
  game: Game;
}

const RoundHistory: FC<Props> = ({ game }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { playerId } = useParams();
  if (!playerId) return null;
  const player = game.players[playerId];
  if (!player) return null;
  if (game.pastRounds.length === 0) return null;

  return (
    <>
      <Button
        size="small"
        onClick={() => setOpen(true)}
        startIcon={<FormatListBulletedIcon />}
      >
        Rounds history
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} anchor="left">
        <Box minWidth="300px">
          <List dense>
            {game.pastRounds.map((round: Round) => {
              const diffCents = roundResultForPlayer(round, playerId);
              let icon = <ArrowForwardIcon />;
              if (diffCents > 0) icon = <ArrowUpwardIcon color="success" />;
              if (diffCents < 0) icon = <ArrowDownwardIcon color="error" />;
              const winnersCount = Object.values(round.bets).filter(
                (bet: Bet) => bet.expectedResult === round.result
              ).length;
              const betsCount = Object.keys(round.bets).length;
              return (
                <ListItem dense>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText
                    primary={round.question}
                    secondary={`${displayAmount(
                      diffCents
                    )} / ${winnersCount} winners / ${betsCount} bets`}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default RoundHistory;
