import { StateMachine } from "../state";
import { GameError } from "../errors";
import { PlayerJoined } from "../events";
import startGame from "./startGame";
import playerJoin, { Options as PlayerJoinOptions } from "./playerJoin";

describe("playerJoin", () => {
  let game = new StateMachine();
  beforeEach(() => {
    game = new StateMachine();
    game.execute(startGame);
  });

  it("should add new player", () => {
    const event = game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
      playerName: "Franck",
    });
    const newPlayerId = event.payload.player.id;
    expect(game.state.players[newPlayerId].name).toBe("Franck");
  });

  it("should fail to add 2nd player with same name", () => {
    game.execute(playerJoin, { playerName: "Franck" });
    expect(() => game.execute(playerJoin, { playerName: "Franck" })).toThrow(
      GameError
    );
  });

  it.todo("should reject join if game did not start");
  it.todo("should reject player with name with less than 2 letters");
  it.todo("should remove bet on current round when player leave");
});
