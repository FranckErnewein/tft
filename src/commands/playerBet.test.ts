import { StateMachine, Player } from "../state";
import { GameError } from "../errors";
import {
  GameStarted,
  PlayerJoined,
  RoundStarted,
  BetTimeStarted,
  PlayerBet,
} from "../events";
import startGame from "./startGame";
import playerJoin, { Options as PlayerJoinOptions } from "./playerJoin";
import startRound from "./startRound";
import startBet from "./startBet";
import playerBet, { Options as PlayerBetOptions } from "./playerBet";

describe("playerBet", () => {
  let game = new StateMachine();
  let player: Player | null = null;
  beforeEach(() => {
    game = new StateMachine();
    game.execute<GameStarted>(startGame, {});
    const event = game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
      playerName: "Franck",
    });
    player = event.payload.player;
    game.execute<RoundStarted>(startRound, {});
    game.execute<BetTimeStarted>(startBet, {});
  });
  it("should bet: create a new bet and reduce player balance", () => {
    if (!player) throw "player not found";
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 200,
      win: true,
      playerId: player.id,
    });
    expect(game.state.currentRound?.bets[player.id].amountCents).toBe(200);
    expect(game.state.players[player.id]?.balanceCents).toBe(800);
  });

  it("should reject bet amount is superior to player's balance", () => {
    expect(() => {
      if (!player) throw "player not found";
      game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
        amountCents: 1200,
        win: true,
        playerId: player.id,
      });
    }).toThrow(GameError);
  });

  it.todo("should edit a bet");
  it.todo("should reject bet because game is not in bet phase");
  it.todo("should reject bet playerId was not found");
});
