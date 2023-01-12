import path from "path";
import bodyParser from "body-parser";
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
import { GameEvent, PlayerJoined, GameStarted } from "./events";

const app: Express = express();
const port = 3000;
const game = new StateMachine();

app.use(express.static(path.join(__dirname, "../dist")));
app.use(bodyParser.json());
app.get("/", (_: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

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
    response.json(event);
  });
};

routeCommand<GameStarted>(startGame);
routeCommand<PlayerJoined, PlayerJoinOptions>(playerJoin, playerJoinValidator);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});