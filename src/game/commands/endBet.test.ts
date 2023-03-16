import { reset, startGame, startRound, endBet } from "./forTest";
import { RoundStatus } from "../types";
import { GameError } from "../errors";

describe("startBet", () => {
  beforeEach(async () => {
    await reset();
    await startGame({});
  });
  it("should start and end time", async () => {
    let [state] = await startRound({});
    expect(state.currentRound?.status).toBe(RoundStatus.BET_TIME);
    [state] = await endBet({});
    expect(state.currentRound?.status).toBe(RoundStatus.RUNNING);
  });

  it("should not end bet time if round was is not in bet mode", () => {
    endBet({}).catch((e) => expect(e).toBeInstanceOf(GameError));
  });

  it.todo("should not allow to bet after end bet");
});
