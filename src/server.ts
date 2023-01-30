import path from "path";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { ValidateFunction } from "ajv/dist/jtd";
import { Server } from "socket.io";
import express, { Express, Request, Response } from "express";
import { GameError } from "./errors";
import { StateMachine } from "./state";
import * as commands from "./commands/";
import {
  GameEvent,
  PlayerJoined,
  PlayerLeft,
  GameStarted,
  RoundStarted,
  PlayerBet,
} from "./events";

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
  O extends commands.types.AbstractOptions = {}
>(
  name: string,
  command: commands.types.Command<E, O>,
  validator?: ValidateFunction<O>
) => {
  const route = `/commands/${name}`;
  app.post(route, (request: Request, response: Response) => {
    if (validator && !validator(request.body || {})) {
      response.status(400);
      response.json({ error: "validation payload", payload: request.body });
      return;
    }
    const options = request.body;
    try {
      const event = game.execute<E, O>(command, options);
      io.emit("gameEvent", event);
      response.json(event);
    } catch (error) {
      if (error instanceof GameError) {
        response.status(400);
        response.json({ error: error });
      } else {
        throw error;
      }
    }
  });
};

routeCommand<GameStarted>("startGame", commands.startGame.command);
routeCommand<PlayerJoined, commands.playerJoin.Options>(
  "playerJoin",
  commands.playerJoin.command,
  commands.playerJoin.Validator
);
routeCommand<PlayerLeft, commands.playerLeave.Options>(
  "playerLeave",
  commands.playerLeave.command,
  commands.playerLeave.Validator
);
routeCommand<RoundStarted>("startRound", commands.startRound.command);
routeCommand<PlayerBet, commands.playerBet.Options>(
  "playerBet",
  commands.playerBet.command,
  commands.playerBet.Validator
);

app.get("/state", (_, response: Response) => {
  response.json(game.state);
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
