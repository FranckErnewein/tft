import path from "path";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io";
import express, { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
// import memorystore from 'memorystore'
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

declare module "express-session" {
  interface SessionData {
    playerId?: string;
    bookmaker?: boolean;
  }
}

// const MemoryStore = memorystore(session)
const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const port = process.env.PORT || 3000;
const game = new StateMachine();
const oneDay = 86400000;

app.use(cors());
app.use(express.static(path.join(__dirname, "../dist")));
app.use(bodyParser.json());
app.use(
  session({
    cookie: { maxAge: oneDay },
    // store: new MemoryStore({ checkPeriod: oneDay }),
    resave: false,
    secret: "s3cr3tFish",
  })
);

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

function reject401(response: Response, message: string): void {
  response.status(401);
  response.json({ type: "error", error: message });
}

function checkIdentity(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  if (
    !request.session.playerId ||
    request.session.playerId !== request.params.playerId
  ) {
    reject401(response, "Player ID do not match in URL and in session");
  } else {
    next();
  }
}

function checkPlayerIdInPayload(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  if (
    request.body.playerId &&
    request.session.playerId &&
    request.session.playerId === request.body.playerId
  ) {
    next();
  } else {
    reject401(response, "Player ID do not match in payload and in sessions");
  }
}

function isBookmaker(request: Request, response: Response, next: NextFunction) {
  if (request.session.bookmaker) next();
  else reject401(response, "Bookmaker command only");
}

routeCommand(startGame);
routeCommand(playerJoin);

routeCommand(playerLeave);
routeCommand(playerBet);
routeCommand(playerCancelBet);

routeCommand(startRound);
routeAsyncCommand(scheduleEndBet);
routeCommand(endBet);
routeCommand(endRound);

io.on("connection", (socket) => socket.emit("gameState", game.state));

app.get("*", function (_, response) {
  response.sendFile(path.join(__dirname, "../dist/index.html"));
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
