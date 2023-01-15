import { StateMachine, RoundStatus } from "./state";
import {
  GameStarted,
  PlayerJoined,
  RoundStarted,
  BetTimeStarted,
} from "./events";
import {
  startGame,
  playerJoin,
  PlayerJoinOptions,
  startRound,
  StartRoundOptions,
  startBet,
  StartBetOptions,
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
      expect(game.state.currentRound).toBeNull();
      game.execute<RoundStarted, StartRoundOptions>(startRound, {});
      expect(game.state.pastRounds.length).toBe(0);
      expect(game.state.currentRound?.startedAt).toBeDefined();
      expect(game.state.currentRound?.endedAt).toBeNull();
      expect(game.state.currentRound?.id).toBeDefined();
      expect(game.state.currentRound?.result).toBeNull();
    });

    it("should start bet time", () => {
      const game = new StateMachine();
      game.execute<GameStarted>(startGame, {});
      game.execute<RoundStarted, StartRoundOptions>(startRound, {});
      game.execute<BetTimeStarted, StartBetOptions>(startBet, {});
      expect(game.state.currentRound?.status).toBe(RoundStatus.BET_TIME);
      expect(game.state.currentRound?.betEndTimer).toBe(5);
    });

    it("should not start bet time if round was not started before", () => {
      const game = new StateMachine();
      game.execute<GameStarted>(startGame, {});
      expect(() =>
        game.execute<BetTimeStarted, StartBetOptions>(startBet, {})
      ).toThrow(GameError);
    });
  });
});
