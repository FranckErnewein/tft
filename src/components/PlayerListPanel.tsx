import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import GroupsIcon from "@mui/icons-material/Groups";

import { Game } from "../state";
import PlayerList from "./PlayerList";

interface Props {
  game: Game;
}

const PlayerListPanel: FC<Props> = ({ game }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { playerId } = useParams();
  if (!playerId) return null;
  const player = game.players[playerId];
  if (!player) return null;

  return (
    <>
      <Button
        size="small"
        onClick={() => setOpen(true)}
        endIcon={<GroupsIcon />}
      >
        Players
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} anchor="right">
        <Box minWidth="300px">
          <PlayerList players={game.players} />
        </Box>
      </Drawer>
    </>
  );
};

export default PlayerListPanel;
