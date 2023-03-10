import { pipeCommand } from "../../pipes";
import { promisify } from "../../utils";
import { Game } from "../types";
import defaultState from "../defaultState";
import { GameEvent, PlayerJoined } from "../events";
import reducer from "../reducer";
import startGame from "./startGame";
// import { createStateStore } from "../stores/inMemory";
import playerJoin, { Options as PlayerJoinOptions } from "./playerJoin";

function dumper<T>(toDump: T | null) {
  return promisify((x: T) => {
    toDump = x;
    return x;
  });
}

describe("startGame", () => {
  let state: Game = defaultState;
  let lastEvent: GameEvent | null = null;
  const getState = promisify<undefined, Game>(() => state);
  const setState = promisify<Game, Game>((s: Game) => (state = s));
  const setLastEvent = promisify<GameEvent, GameEvent>(
    (e: GameEvent) => (lastEvent = e)
  );
  const cmdStartGame = pipeCommand<undefined, GameEvent, Game>(
    getState,
    startGame,
    setLastEvent,
    reducer,
    setState
  );
  let cmdPlayerJoin = pipeCommand<PlayerJoinOptions, GameEvent, Game>(
    getState,
    playerJoin,
    dumper<GameEvent>(lastEvent),
    reducer,
    dumper<Game>(state)
  );

  beforeEach(() => (state = defaultState));

  it("should init the game correctly", async () => {
    await cmdStartGame(undefined);
    expect(state?.id).toBeDefined();
    expect(state?.startedAt).toBeDefined();
  });

  it("should reset game", async () => {
    await cmdStartGame(undefined);
    await cmdPlayerJoin({ playerName: "Franck" });
    await cmdStartGame(undefined);
    expect(state?.players).toEqual({});
  });
});
