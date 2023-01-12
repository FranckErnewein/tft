import path from "path";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { ValidateFunction } from "ajv/dist/jtd";
import { Server } from "socket.io";
import express, { Express, Request, Response } from "express";
import { StateMachine } from "./state";
import {
  Command,
  AbstractOptions,
  startGame,
  playerJoin,
  playerJoinValidator,
  PlayerJoinOptions,
} from "./commands";
import { GameEvent, PlayerJoined, GameStarted } from "./events";

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const port = 3000;
const game = new StateMachine();

app.use(cors());
app.use(express.static(path.join(__dirname, "../dist")));
app.use(bodyParser.json());

export const routeCommand = <
  E extends GameEvent,
  O extends AbstractOptions = {}
>(
  command: Command<E, O>,
  validator?: ValidateFunction<O>
) => {
  const route = `/commands/${command.name}`;
  app.post(route, (request: Request, response: Response) => {
    if (validator && !validator(request.body || {})) {
      response.status(400);
      response.json({ error: "validation payload", payload: request.body });
      return;
    }
    const options = request.body;
    const event = game.execute<E, O>(command, options);
    io.emit("gameEvent", event);
    response.json(event);
  });
};

routeCommand<GameStarted>(startGame);
routeCommand<PlayerJoined, PlayerJoinOptions>(playerJoin, playerJoinValidator);

app.get("/state", (_, response: Response) => {
  response.json(game.state);
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
