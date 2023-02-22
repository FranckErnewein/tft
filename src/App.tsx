import { useGame } from "./hooks";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Bookmaker from "./components/Bookmaker";
import JoinGame from "./components/JoinGame";
import Play from "./components/Play";
import DumpState from "./components/DumpState";
import Betting from "./stories/Betting";
import AnimatedAmountStory from "./stories/AnimatedAmountStory";

function App() {
  const game = useGame();

  return (
    <Routes>
      <Route path="/" element={<Layout game={game} />}>
        <Route index element={<JoinGame game={game} />} />
        <Route path="bookmaker" element={<Bookmaker {...game} />} />
        <Route path="player/:playerId" element={<Play game={game} />} />
        <Route path="story">
          <Route path="betting/:playerId" element={<Betting />} />
          <Route path="animated-amount" element={<AnimatedAmountStory />} />
        </Route>
        <Route path="debug">
          <Route path="state" element={<DumpState game={game} />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
