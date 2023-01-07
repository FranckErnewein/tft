import { StateMachine } from "./state";
import { onGameStarted, onPlayerJoined } from "./reducer";
import { GameStarted, PlayerJoined } from "./events";
import { startGame, playerJoin, PlayerJoinOptions } from "./commands";
import { GameError } from "./errors";

describe("game", () => {
  describe("game start", () => {
    it("should init the game correcty", () => {
      const game = new StateMachine();
      game.execute<GameStarted>(startGame, {}, onGameStarted);
      expect(game.state.id).toBeDefined();
      expect(game.state.startedAt).not.toBeNull();
    });

    it("should reject game creation because one already exist", () => {
      const game = new StateMachine();
      game.execute<GameStarted>(startGame, {}, onGameStarted);
      expect(() => game.execute(startGame, {}, onGameStarted)).toThrow(
        GameError
      );
    });
  });

  describe("new player", () => {
    it("should add new player", () => {
      const game = new StateMachine();
      game.execute<GameStarted>(startGame, {}, onGameStarted);
      const event = game.execute<PlayerJoined, PlayerJoinOptions>(
        playerJoin,
        {
          playerName: "Franck",
        },
        onPlayerJoined
      );
      const newPlayerId = event.payload.player.id;
      expect(game.state.players[newPlayerId].name).toBe("Franck");
    });

    it("should fail to add 2nd player with same name", () => {
      const game = new StateMachine();
      game.execute<GameStarted>(startGame, {});
      game.execute<PlayerJoined, PlayerJoinOptions>(
        playerJoin,
        {
          playerName: "Franck",
        },
        onPlayerJoined
      );
      expect(() =>
        game.execute<PlayerJoined, PlayerJoinOptions>(
          playerJoin,
          {
            playerName: "Franck",
          },
          onPlayerJoined
        )
      ).toThrow(GameError);
    });
  });
});
