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
import startBet from "./commands/startBet";
import playerBet from "./commands/playerBet";
import endRound from "./commands/endRound";

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const port = 3000;
const game = new StateMachine();

app.use(cors());
app.use(express.static(path.join(__dirname, "../dist")));
app.use(bodyParser.json());

export const routeCommand = (name: string, command: Command<any>) => {
  const route = `/commands/${name}`;
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

routeCommand("startGame", startGame);
routeCommand("playerJoin", playerJoin);
routeCommand("playerLeave", playerLeave);
routeCommand("startRound", startRound);
routeCommand("startBet", startBet);
routeCommand("playerBet", playerBet);
routeCommand("endRound", endRound);

app.get("/state", (_, response: Response) => {
  response.json(game.state);
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
