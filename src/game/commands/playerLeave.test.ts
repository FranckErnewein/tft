import { StateMachine } from "../state";
import { PlayerJoined, PlayerLeft } from "../events";
import startGame from "./startGame";
import playerJoin, { Options as PlayerJoinOptions } from "./playerJoin";
import playerLeave, { Options as PlayerLeaveOptions } from "./playerLeave";

describe("playerLeave", () => {
  it("should join and leave", () => {
    const game = new StateMachine();
    game.execute(startGame);
    const event = game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
      playerName: "Franck",
    });
    game.execute<PlayerLeft, PlayerLeaveOptions>(playerLeave, {
      playerId: event.payload.player.id,
    });
    expect(Object.keys(game.state.players)).toHaveLength(0);
  });
});
