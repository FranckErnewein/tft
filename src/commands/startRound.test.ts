import { StateMachine } from "../state";
import startGame from "./startGame";
import startRound from "./startRound";

describe("playerJoin", () => {
  it("should start a new round", () => {
    const game = new StateMachine();
    game.execute(startGame);
    expect(game.state.currentRound).toBeNull();
    game.execute(startRound);
    expect(game.state.pastRounds.length).toBe(0);
    expect(game.state.currentRound?.startedAt).toBeDefined();
    expect(game.state.currentRound?.endedAt).toBeNull();
    expect(game.state.currentRound?.betEndTimer).toBeNull();
    expect(game.state.currentRound?.id).toBeDefined();
    expect(game.state.currentRound?.result).toBeNull();
  });

  it.todo(
    "should fail when try to start a new round without finish previous one"
  );
});
