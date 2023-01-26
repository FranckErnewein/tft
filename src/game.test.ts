import { StateMachine, RoundStatus, Game, Player } from "./state";
import {
  GameStarted,
  PlayerJoined,
  PlayerLeft,
  RoundStarted,
  BetTimeStarted,
  PlayerBet,
} from "./events";
import {
  startGame,
  playerJoin,
  PlayerJoinOptions,
  playerLeave,
  PlayerLeaveOptions,
  startRound,
  StartRoundOptions,
  startBet,
  StartBetOptions,
  playerBet,
  PlayerBetOptions,
} from "./commands";
import { GameError } from "./errors";

describe("game", () => {
  describe("game start", () => {
    it("should init the game correctly", () => {
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

    it("should join and leave", () => {
      const game = new StateMachine();
      game.execute<GameStarted>(startGame, {});
      const event = game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
        playerName: "Franck",
      });
      game.execute<PlayerLeft, PlayerLeaveOptions>(playerLeave, {
        playerId: event.payload.player.id,
      });
      expect(Object.keys(game.state.players)).toHaveLength(0);
    });

    it.todo("should reject join if game did not start");
    it.todo("should reject player with empty name");
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

    describe("bet", () => {
      let game: StateMachine | null = null;
      let player: Player | null = null;
      beforeEach(() => {
        game = new StateMachine();
        game.execute<GameStarted>(startGame, {});
        const event = game.execute<PlayerJoined, PlayerJoinOptions>(
          playerJoin,
          {
            playerName: "Franck",
          }
        );
        player = event.payload.player;
        game.execute<RoundStarted, StartRoundOptions>(startRound, {});
        game.execute<BetTimeStarted, StartBetOptions>(startBet, {});
      });
      it("should bet: create a new bet and reduce player balance", () => {
        if (!game || !player) throw "game not initialized";
        game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
          amountCents: 200,
          win: true,
          playerId: player.id,
        });
        expect(game.state.currentRound?.bets[player.id].amountCents).toBe(200);
        expect(game.state.players[player.id]?.balanceCents).toBe(800);
      });

      it.todo("should edit a bet");
      it.todo("should reject bet because game is not in bet phase");
      it.todo("should reject bet playerId was not found");
      it.todo("should reject bet amount is superior to player's balance");
    });
  });
});
