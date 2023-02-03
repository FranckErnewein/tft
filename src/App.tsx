import { useGame } from "./hooks";
import { Routes, Route } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Admin from "./components/Admin";
import JoinGame from "./components/JoinGame";
import Play from "./components/Play";
import Betting from "./stories/Betting";

function App() {
  const game = useGame();

  return (
    <Container className="App">
      <AppBar>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1, p: 1 }}>
          Team For Gamble
        </Typography>
      </AppBar>

      <Box mt={12}>
        <Routes>
          <Route path="/">
            <Route index element={<JoinGame />} />
            <Route path="admin" element={<Admin {...game} />} />
            <Route path="player/:playerId" element={<Play game={game} />} />
            <Route path="story">
              <Route path="betting/:playerId" element={<Betting />} />
            </Route>
          </Route>
        </Routes>
      </Box>
    </Container>
  );
}

export default App;
