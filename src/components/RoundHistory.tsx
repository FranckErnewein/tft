import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { Game, Round } from "../state";

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
      <Button size="small" onClick={() => setOpen(true)}>
        Match history
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <List>
          {game.pastRounds.map((round: Round, i: number) => {
            return (
              <ListItem>
                <ListItemText primary={`Round n°${i + 1}`} />;
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
};

export default RoundHistory;
