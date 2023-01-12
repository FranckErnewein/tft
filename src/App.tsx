import { useGame } from "./hooks";

function App() {
  const game = useGame();

  return (
    <div className="App">
      <h1>TFT app</h1>
      <hr />
      <pre>{JSON.stringify(game, null, 2)}</pre>
    </div>
  );
}

export default App;
