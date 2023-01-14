import { StateMachine } from "./state";
import { GameStarted, PlayerJoined, RoundStarted } from "./events";
import {
  startGame,
  playerJoin,
  PlayerJoinOptions,
  startRound,
  StartRoundOptions,
} from "./commands";
import { GameError } from "./errors";

describe("game", () => {
  describe("game start", () => {
    it("should init the game correcty", () => {
      const game = new StateMachine();
      game.execute<GameStarted>(startGame, {});
      expect(game.state.id).toBeDefined();
      expect(game.state.startedAt).not.toBeNull();
    });

    it("should reset game", () => {
      const game = new StateMachine();
      game.execute<GameStarted>(startGame, {});
      game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
        playerName: "Franck",
      });
      game.execute<GameStarted>(startGame, {});
      expect(Object.keys(game.state.players).length).toBe(0);
    });
  });

  describe("new player", () => {
    it("should add new player", () => {
      const game = new StateMachine();
      game.execute<GameStarted>(startGame, {});
      const event = game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
        playerName: "Franck",
      });
      const newPlayerId = event.payload.player.id;
      expect(game.state.players[newPlayerId].name).toBe("Franck");
    });

    it("should fail to add 2nd player with same name", () => {
      const game = new StateMachine();
      game.execute<GameStarted>(startGame, {});
      game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
        playerName: "Franck",
      });
      expect(() =>
        game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
          playerName: "Franck",
        })
      ).toThrow(GameError);
    });
  });

  describe("rounds", () => {
    it("should start a new round", () => {
      const game = new StateMachine();
      game.execute<GameStarted>(startGame, {});
      game.execute<RoundStarted, StartRoundOptions>(startRound, {});
      expect(game.state.rounds.length).toBe(1);
      expect(game.state.rounds[0]?.startedAt).toBeDefined();
      expect(game.state.rounds[0]?.endedAt).toBeNull();
      expect(game.state.rounds[0]?.id).toBeDefined();
      expect(game.state.rounds[0]?.result).toBeNull();
    });
  });
});
