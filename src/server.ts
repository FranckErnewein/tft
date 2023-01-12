import path from "path";
import { ValidateFunction } from "ajv/dist/jtd";
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
import { AbstractEvent, PlayerJoined, GameStarted } from "./events";

const app: Express = express();
const port = 3000;
const game = new StateMachine();

app.use(express.static(path.join(__dirname, "../dist")));
app.get("/", (_: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

export const routeCommand = <
  E extends AbstractEvent,
  O extends AbstractOptions = {}
>(
  command: Command<E, O>,
  validator?: ValidateFunction<O>
) => {
  const route = `/commands/${command.name}`;
  console.log("init route", route);
  app.post(route, (request: Request, response: Response) => {
    if (validator && !validator(request.body || {})) {
      response.status(400);
      response.json({ error: "validation payload" });
      return;
    }
    const options = request.body;
    console.log("old state", game.state);
    const event = game.execute<E, O>(command, options);
    console.log("command", command.name, "w/", options);
    console.log("result event", event);
    console.log("new state", game.state);
    response.json(event);
  });
};

routeCommand<GameStarted>(startGame);
routeCommand<PlayerJoined, PlayerJoinOptions>(playerJoin, playerJoinValidator);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
