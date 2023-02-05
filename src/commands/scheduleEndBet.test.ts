import { StateMachine, RoundStatus } from "../state";
import { BetTimeDecreased, BetTimeEnded } from "../events";
import startGame from "./startGame";
import startRound from "./startRound";
import scheduleEndBet, { Options as SEBOptions } from "./scheduleEndBet";

describe("scheduleEndBet", () => {
  let game = new StateMachine();
  beforeEach(() => {
    game = new StateMachine();
    game.execute(startGame);
  });
  it("should start end time", (done) => {
    const game = new StateMachine();
    game.execute(startRound);
    game.executeAsync<BetTimeDecreased | BetTimeEnded, SEBOptions>(
      scheduleEndBet,
      {
        restTime: 50,
        interval: 10,
      },
      () => {
        console.log("huu");
        // TODO implement restingTime on round in reducer
        expect(game.state.currentRound?.status).toBe(RoundStatus.BET_TIME);
      },
      () => {
        expect(game.state.currentRound?.status).toBe(RoundStatus.RUNNING);
        done();
      }
    );
  });

  it.todo("should not schedule end bet time if round was is not in bet mode");
  it.todo("should not allow to bet after end bet");
});
