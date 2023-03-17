import { reset, startGame, startRound } from "./forTest";

describe("playerJoin", () => {
  beforeEach(async () => {
    await reset();
  });
  it("should start a new round", async () => {
    const [preState] = await startGame({});
    expect(preState.currentRound).toBeNull();
    const [state] = await startRound({});
    expect(state.pastRounds.length).toBe(0);
    expect(state.currentRound?.startedAt).toBeDefined();
    expect(state.currentRound?.endedAt).toBeNull();
    expect(state.currentRound?.betEndTimer).toBeNull();
    expect(state.currentRound?.id).toBeDefined();
    expect(state.currentRound?.result).toBeNull();
  });

  it.todo(
    "should fail when try to start a new round without finish previous one"
  );
});
