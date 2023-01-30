import { StateMachine } from "../state";
import { GameStarted, PlayerJoined } from "../events";
import * as startGame from "./startGame";
import * as playerJoin from "./playerJoin";

describe("startGame", () => {
  it("should init the game correctly", () => {
    const game = new StateMachine();
    game.execute<GameStarted>(startGame.command, {});
    expect(game.state.id).toBeDefined();
    expect(game.state.startedAt).not.toBeNull();
  });

  it("should reset game", () => {
    const game = new StateMachine();
    game.execute<GameStarted>(startGame.command, {});
    game.execute<PlayerJoined, playerJoin.Options>(playerJoin.command, {
      playerName: "Franck",
    });
    game.execute<GameStarted>(startGame.command, {});
    expect(Object.keys(game.state.players).length).toBe(0);
  });
});
