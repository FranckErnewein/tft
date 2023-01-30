import { StateMachine, RoundStatus } from "../state";
import { GameStarted, RoundStarted, BetTimeStarted } from "../events";
import { GameError } from "../errors";
import * as startGame from "./startGame";
import * as startRound from "./startRound";
import * as startBet from "./startBet";

describe("startBet", () => {
  let game = new StateMachine();
  beforeEach(() => {
    game = new StateMachine();
    game.execute<GameStarted>(startGame.command, {});
  });
  it("should start bet time", () => {
    const game = new StateMachine();
    game.execute<RoundStarted, startRound.Options>(startRound.command, {});
    game.execute<BetTimeStarted, startBet.Options>(startBet.command, {});
    expect(game.state.currentRound?.status).toBe(RoundStatus.BET_TIME);
    expect(game.state.currentRound?.betEndTimer).toBe(5);
  });

  it("should not start bet time if round was not started before", () => {
    expect(() =>
      game.execute<BetTimeStarted, startBet.Options>(startBet.command, {})
    ).toThrow(GameError);
  });
});
