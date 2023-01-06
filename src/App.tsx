import useChampionQuery from "./useChampionsQuery";
import { filter65Champions } from "./mapper";
import { ChampionInterface } from "./types";
import Champion from "./Champion";
import ForceGraph from "./ForceGraph";

function App() {
  const champions = filter65Champions(useChampionQuery());

  return (
    <div className="App">
      <h1>TFT viewer</h1>
      <hr />
      <div style={{ display: "flex" }}>
        {champions.map((champion: ChampionInterface) => (
          <Champion key={champion.championId} champion={champion} />
        ))}
      </div>
      <hr />
      <ForceGraph></ForceGraph>
    </div>
  );
}

export default App;
