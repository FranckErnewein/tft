import { RoundStatus } from "../types";
import { EventType } from "../events";
import { reset, state, startGame, startRound, scheduleEndBet } from "./forTest";

describe("scheduleEndBet", () => {
  beforeEach(async () => {
    await reset();
    await startGame({});
    await startRound({});
  });
  it("should schedule end of bet", async () => {
    const s = await state();
    expect(s.currentRound?.status).toBe(RoundStatus.BET_TIME);
    expect(s.currentRound?.betEndTimer).toBeNull();
    const [s2] = await scheduleEndBet(
      {
        restTime: 500,
        interval: 100,
      },
      (event) => {
        if (event.type === EventType.BET_TIME_DECREASED) {
          expect(event.payload.restTime).toBeGreaterThan(0);
          state().then((tempState) => {
            expect(tempState.currentRound?.status).toBe(RoundStatus.BET_TIME);
            expect(tempState.currentRound?.betEndTimer).not.toBeNull();
          });
        }
      }
    );
    expect(s2.currentRound?.status).toBe(RoundStatus.RUNNING);
    expect(s2.currentRound?.betEndTimer).toBe(0);
  });

  it.todo("should not schedule end bet time if round was is not in bet mode");
  it.todo("should not allow to bet after end bet");
  it.todo(
    "should stop if somebody end manually before the end of schedule time "
  );
});
