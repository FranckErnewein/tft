import { reset, startGame, playerJoin, playerLeave } from "./forTest";

describe("playerLeave", () => {
  it("should join and leave", async () => {
    await reset();
    await startGame({});
    const [_, event] = await playerJoin({ playerName: "Franck" });
    const [state] = await playerLeave({ playerId: event.payload.player.id });
    expect(Object.keys(state.players)).toHaveLength(0);
  });
});
