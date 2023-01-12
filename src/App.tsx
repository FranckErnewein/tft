import { useEffect } from "react";
import io from "socket.io-client";

function App() {
  useEffect(() => {
    const socket = io("http://localhost:3000/");

    socket.on("gameEvent", (event) => console.log(event));
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="App">
      <h1>TFT app</h1>
      <hr />
    </div>
  );
}

export default App;
