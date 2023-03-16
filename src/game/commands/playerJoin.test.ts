import { reset, startGame, playerJoin } from "./forTest";
import { GameError } from "../errors";

describe("playerJoin", () => {
  beforeEach(async () => {
    await reset();
    await startGame({});
  });

  it("should add new player", async () => {
    const state = await playerJoin({ playerName: "Franck" });
    expect(Object.values(state.players)[0]?.name).toBe("Franck");
  });

  it("should fail to add 2nd player with same name", async () => {
    await playerJoin({ playerName: "Franck" });
    playerJoin({ playerName: "Franck" }).catch((e) =>
      expect(e).toBeInstanceOf(GameError)
    );
  });

  it("should reject join if game did not start", async () => {
    reset();
    playerJoin({ playerName: "Franck" }).catch((e) =>
      expect(e).toBeInstanceOf(GameError)
    );
  });

  it.todo("should reject player with name with less than 2 letters");
  it.todo("should remove bet on current round when player leave");
});
