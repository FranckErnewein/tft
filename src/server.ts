import path from "path";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io";
import express, { Express, Request, Response } from "express";
import { GameError, CommandOptionError } from "./errors";
import { StateMachine } from "./state";
import { Command, AsyncCommand } from "./commands/types";
import startGame from "./commands/startGame";
import startRound from "./commands/startRound";
import playerJoin from "./commands/playerJoin";
import playerLeave from "./commands/playerLeave";
import playerBet from "./commands/playerBet";
import playerCancelBet from "./commands/playerCancelBet";
import scheduleEndBet from "./commands/scheduleEndBet";
import endBet from "./commands/endBet";
import endRound from "./commands/endRound";

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const port = process.env.PORT || 3000;
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
      response.json({ type: "event", event: event });
    } catch (error) {
      if (error instanceof GameError || error instanceof CommandOptionError) {
        response.status(400);
        response.json({ type: "error", error: error });
      } else {
        throw error;
      }
    }
  });
};

export const routeAsyncCommand = (command: AsyncCommand<any>) => {
  const route = `/commands/${command.name}`;
  app.post(route, (request: Request, response: Response) => {
    const options = request.body;
    try {
      game.executeAsync(command, options, (event) => {
        io.emit("gameEvent", event);
      });
      response.json({ type: "async" });
    } catch (error) {
      if (error instanceof GameError || error instanceof CommandOptionError) {
        response.status(400);
        response.json({ type: "error", error: error });
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
routeCommand(playerCancelBet);
routeAsyncCommand(scheduleEndBet);
routeCommand(endBet);
routeCommand(endRound);

app.get("/state", (_, response: Response) => {
  response.json(game.state);
});

app.get("*", function (_, response) {
  response.sendFile(path.join(__dirname, "../dist/index.html"));
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
