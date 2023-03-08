import { pipeCommand } from "../StateMachine";
import { EMPTY_GAME, Game } from "../state";
import { PlayerJoined, GameEvent } from "../events";
import reducer from "../reducer";
import startGame from "./startGame";
import { createStateStore } from "../stores/inMemory";
import { promisify, identity } from "../utils";
import playerJoin, { Options as PlayerJoinOptions } from "./playerJoin";

describe("startGame", () => {
  let state: Game | null = null;
  let lastEvent: GameEvent | null = null;
  const dumpState = promisify((s: Game) => (state = s));
  const dumpEvent = promisify((e: GameEvent) => (lastEvent = e));
  let cmdStartGame = pipeCommand<undefined, GameEvent, Game>(
    EMPTY_GAME,
    startGame,
    dumpEvent,
    reducer
    dumpState
  );
  let cmdPlayerJoin = pipeCommand(
    EMPTY_GAME,
    playerJoin,
    dumpEvent,
    gameMachine,
    dumpState
  );

  beforeEach(() => (state = null));

  it("should init the game correctly", () => {
    cmdStartGame(undefined);
    expect(state?.id).toBeDefined();
    expect(state?.startedAt).toBeDefined();
  });

  it("should reset game", () => {
    cmdStartGame(undefined);
    cmdPlayerJoin({ playerName: "Franck" });
    cmdStartGame(undefined);
    expect(state?.players).toBe({});
  });
});
