import { StateMachine } from "../state";
import { PlayerJoined } from "../events";
import startGame from "./startGame";
import playerJoin, { Options as PlayerJoinOptions } from "./playerJoin";

describe("startGame", () => {
  it("should init the game correctly", () => {
    const game = new StateMachine();
    game.execute(startGame, {});
    expect(game.state.id).toBeDefined();
    expect(game.state.startedAt).not.toBeNull();
  });

  it("should reset game", () => {
    const game = new StateMachine();
    game.execute(startGame, {});
    game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
      playerName: "Franck",
    });
    game.execute(startGame, {});
    expect(Object.keys(game.state.players).length).toBe(0);
  });
});
