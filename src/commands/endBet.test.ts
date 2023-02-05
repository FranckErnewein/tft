import { StateMachine, RoundStatus } from "../state";
import { GameError } from "../errors";
import startGame from "./startGame";
import startRound from "./startRound";
import endBet from "./endBet";

describe("startBet", () => {
  let game = new StateMachine();
  beforeEach(() => {
    game = new StateMachine();
    game.execute(startGame);
  });
  it("should start end time", () => {
    const game = new StateMachine();
    game.execute(startRound);
    expect(game.state.currentRound?.status).toBe(RoundStatus.BET_TIME);
    game.execute(endBet);
    expect(game.state.currentRound?.status).toBe(RoundStatus.RUNNING);
  });

  it("should not end bet time if round was is not in bet mode", () => {
    expect(() => game.execute(endBet)).toThrow(GameError);
  });

  it.todo("should not allow to bet after end bet");
});
