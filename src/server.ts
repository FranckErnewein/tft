import path from "path";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io";
import express, { Express, Request, Response } from "express";
import { GameError, CommandOptionError } from "./errors";
import { StateMachine } from "./state";
import { Command } from "./commands/types";
import startGame from "./commands/startGame";
import startRound from "./commands/startRound";
import playerJoin from "./commands/playerJoin";
import playerLeave from "./commands/playerLeave";
import playerBet from "./commands/playerBet";
import endBet from "./commands/endBet";
import endRound from "./commands/endRound";

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const port = 3000;
const game = new StateMachine();

app.use(cors());
app.use(express.static(path.join(__dirname, "../dist")));
app.use(bodyParser.json());

export const routeCommand = (command: Command<any>) => {
  const route = `/commands/${command.name}`;
  app.post(route, (request: Request, response: Response) => {
    const options = request.body;
    try {
      const event = game.execute(command, options);
      io.emit("gameEvent", event);
      response.json(event);
    } catch (error) {
      if (error instanceof GameError || error instanceof CommandOptionError) {
        response.status(400);
        response.json({ error: error });
      } else {
        throw error;
      }
    }
  });
};

routeCommand(startGame);
routeCommand(playerJoin);
routeCommand(playerLeave);
routeCommand(startRound);
routeCommand(playerBet);
routeCommand(endBet);
routeCommand(endRound);

app.get("/state", (_, response: Response) => {
  response.json(game.state);
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
