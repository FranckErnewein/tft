import { StateMachine, RoundStatus } from "../state";
import { GameError } from "../errors";
import startGame from "./startGame";
import startRound from "./startRound";
import startBet from "./startBet";

describe("startBet", () => {
  let game = new StateMachine();
  beforeEach(() => {
    game = new StateMachine();
    game.execute(startGame, {});
  });
  it("should start bet time", () => {
    const game = new StateMachine();
    game.execute(startRound, {});
    game.execute(startBet, {});
    expect(game.state.currentRound?.status).toBe(RoundStatus.BET_TIME);
    expect(game.state.currentRound?.betEndTimer).toBe(5);
  });

  it("should not start bet time if round was not started before", () => {
    expect(() => game.execute(startBet, {})).toThrow(GameError);
  });
});
