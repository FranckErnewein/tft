import { FC } from "react";
import { Outlet } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";

import { Game } from "../state";
import PlayerMenu from "./PlayerMenu";

interface Props {
  game: Game;
}

const Layout: FC<Props> = ({ game }) => {
  return (
    <Container className="App">
      <AppBar>
        <Grid container>
          <Grid item xs={4}>
            <Typography variant="h5" component="h1" sx={{ flexGrow: 1, p: 1 }}>
              Minibet
            </Typography>
          </Grid>
          <Grid item xs={8} textAlign="right">
            <PlayerMenu game={game} />
          </Grid>
        </Grid>
      </AppBar>
      <Box mt={12}>
        <Outlet />
      </Box>
    </Container>
  );
};

export default Layout;
