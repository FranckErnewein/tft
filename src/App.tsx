import { useGame } from "./hooks";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Admin from "./components/Admin";
import JoinGame from "./components/JoinGame";
import Play from "./components/Play";
import Betting from "./stories/Betting";

function App() {
  const game = useGame();

  return (
    <Routes>
      <Route path="/" element={<Layout game={game} />}>
        <Route index element={<JoinGame />} />
        <Route path="admin" element={<Admin {...game} />} />
        <Route path="player/:playerId" element={<Play game={game} />} />
        <Route path="story">
          <Route path="betting/:playerId" element={<Betting />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
