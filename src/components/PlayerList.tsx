import { FC } from "react";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemIcon";

import { Player } from "../state";
import { displayAmount } from "../utils";

interface Props {
  players: Record<string, Player>;
}

const PlayerList: FC<Props> = ({ players }) => {
  return (
    <List>
      {Object.values(players).map((player: Player) => {
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
  );
};

export default PlayerList;
