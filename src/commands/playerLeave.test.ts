import { StateMachine } from "../state";
import { GameStarted, PlayerJoined, PlayerLeft } from "../events";
import * as startGame from "./startGame";
import * as playerJoin from "./playerJoin";
import * as playerLeave from "./playerLeave";

describe("playerLeave", () => {
  it("should join and leave", () => {
    const game = new StateMachine();
    game.execute<GameStarted>(startGame.command, {});
    const event = game.execute<PlayerJoined, playerJoin.Options>(
      playerJoin.command,
      {
        playerName: "Franck",
      }
    );
    game.execute<PlayerLeft, playerLeave.Options>(playerLeave.command, {
      playerId: event.payload.player.id,
    });
    expect(Object.keys(game.state.players)).toHaveLength(0);
  });
});
