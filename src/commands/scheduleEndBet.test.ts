import { StateMachine, RoundStatus } from "../state";
import { BetTimeDecreased, BetTimeEnded, EventType } from "../events";
import startGame from "./startGame";
import startRound from "./startRound";
import scheduleEndBet, { Options as SEBOptions } from "./scheduleEndBet";

describe("scheduleEndBet", () => {
  let game = new StateMachine();
  beforeEach(() => {
    game = new StateMachine();
    game.execute(startGame);
    game.execute(startRound);
  });
  it("should schedule end of bet", (done) => {
    expect(game.state.currentRound?.status).toBe(RoundStatus.BET_TIME);
    expect(game.state.currentRound?.betEndTimer).toBeNull();
    game.executeAsync<BetTimeDecreased | BetTimeEnded, SEBOptions>(
      scheduleEndBet,
      {
        restTime: 50,
        interval: 10,
      },
      (event) => {
        if (event.type === EventType.BET_TIME_DECREASED) {
          expect(event.payload.restTime).toBeGreaterThan(0);
          expect(game.state.currentRound?.status).toBe(RoundStatus.BET_TIME);
          expect(game.state.currentRound?.betEndTimer).not.toBeNull();
        }
      },
      () => {
        expect(game.state.currentRound?.status).toBe(RoundStatus.RUNNING);
        expect(game.state.currentRound?.betEndTimer).toBe(0);
        done();
      }
    );
  });

  it.todo("should not schedule end bet time if round was is not in bet mode");
  it.todo("should not allow to bet after end bet");
  it.todo(
    "should stop if somebody end manually before the end of schedule time "
  );
});
