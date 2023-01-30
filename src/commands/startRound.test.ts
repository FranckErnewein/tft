import { StateMachine } from "../state";
import { GameStarted, RoundStarted } from "../events";
import * as startGame from "./startGame";
import * as startRound from "./startRound";

describe("playerJoin", () => {
  it("should start a new round", () => {
    const game = new StateMachine();
    game.execute<GameStarted>(startGame.command, {});
    expect(game.state.currentRound).toBeNull();
    game.execute<RoundStarted, startRound.Options>(startRound.command, {});
    expect(game.state.pastRounds.length).toBe(0);
    expect(game.state.currentRound?.startedAt).toBeDefined();
    expect(game.state.currentRound?.endedAt).toBeNull();
    expect(game.state.currentRound?.id).toBeDefined();
    expect(game.state.currentRound?.result).toBeNull();
  });

  it.todo(
    "should fail when try to start a new round without finish previous one"
  );
});
