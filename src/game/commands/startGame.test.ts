import { reset, startGame, playerJoin } from "./forTest";

describe("startGame", () => {
  beforeEach(() => reset(undefined));

  it("should init the game correctly", async () => {
    const state = await startGame(undefined);
    expect(state.id).toBeDefined();
    expect(state.startedAt).toBeDefined();
  });

  it("should reset game", async () => {
    await startGame(undefined);
    await playerJoin({ playerName: "Franck" });
    const state = await startGame(undefined);
    expect(state.players).toEqual({});
  });
});
