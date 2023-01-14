import { useGame } from "./hooks";
import { Routes, Route } from "react-router-dom";
import Admin from "./components/Admin";
import JoinGame from "./components/JoinGame";
import Play from "./components/Play";

function App() {
  const game = useGame();

  return (
    <div className="App">
      <h1>Team For Gamble</h1>

      <Routes>
        <Route path="/">
          <Route index element={<JoinGame />} />
          <Route path="admin" element={<Admin {...game} />} />
          <Route path="player/:playerId" element={<Play game={game} />} />
        </Route>
      </Routes>

      <hr />
      <pre>{JSON.stringify(game, null, 2)}</pre>
    </div>
  );
}

export default App;
