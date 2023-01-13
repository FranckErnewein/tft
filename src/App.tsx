import { useGame } from "./hooks";
import Admin from "./components/Admin";

function App() {
  const game = useGame();

  return (
    <div className="App">
      <h1>TFT app</h1>
      <hr />
      <pre>{JSON.stringify(game, null, 2)}</pre>
      <hr />
      <Admin {...game}></Admin>
    </div>
  );
}

export default App;
