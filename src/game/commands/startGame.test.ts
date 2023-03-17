import { reset, startGame, playerJoin } from "./forTest";

describe("startGame", () => {
  beforeEach(async () => await reset());

  it("should init the game correctly", async () => {
    const [state] = await startGame({});
    expect(state.id).toBeDefined();
    expect(state.startedAt).toBeDefined();
  });

  it("should reset game", async () => {
    await startGame({});
    await playerJoin({ playerName: "Franck" });
    const [state] = await startGame({});
    expect(state.players).toEqual({});
  });
});
