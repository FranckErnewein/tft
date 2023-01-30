import { StateMachine } from "../state";
import { GameStarted, PlayerJoined } from "../events";
import { GameError } from "../errors";
import * as startGame from "./startGame";
import * as playerJoin from "./playerJoin";

describe("playerJoin", () => {
  let game = new StateMachine();
  beforeEach(() => {
    game = new StateMachine();
    game.execute<GameStarted>(startGame.command, {});
  });

  it("should add new player", () => {
    const event = game.execute<PlayerJoined, playerJoin.Options>(
      playerJoin.command,
      {
        playerName: "Franck",
      }
    );
    const newPlayerId = event.payload.player.id;
    expect(game.state.players[newPlayerId].name).toBe("Franck");
  });

  it("should fail to add 2nd player with same name", () => {
    game.execute<PlayerJoined, playerJoin.Options>(playerJoin.command, {
      playerName: "Franck",
    });
    expect(() =>
      game.execute<PlayerJoined, playerJoin.Options>(playerJoin.command, {
        playerName: "Franck",
      })
    ).toThrow(GameError);
  });

  it.todo("should reject join if game did not start");
  it.todo("should reject player with empty name");
  it.todo("should remove bet on current round when player leave");
});
