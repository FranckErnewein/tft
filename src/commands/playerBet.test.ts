import { StateMachine, Player } from "../state";
import { GameError } from "../errors";
import {
  GameStarted,
  PlayerJoined,
  RoundStarted,
  BetTimeStarted,
  PlayerBet,
} from "../events";
import * as startGame from "./startGame";
import * as playerJoin from "./playerJoin";
import * as startRound from "./startRound";
import * as startBet from "./startBet";
import * as playerBet from "./playerBet";

describe("playerBet", () => {
  let game = new StateMachine();
  let player: Player | null = null;
  beforeEach(() => {
    game = new StateMachine();
    game.execute<GameStarted>(startGame.command, {});
    const event = game.execute<PlayerJoined, playerJoin.Options>(
      playerJoin.command,
      {
        playerName: "Franck",
      }
    );
    player = event.payload.player;
    game.execute<RoundStarted, startRound.Options>(startRound.command, {});
    game.execute<BetTimeStarted, startBet.Options>(startBet.command, {});
  });
  it("should bet: create a new bet and reduce player balance", () => {
    if (!player) throw "player not found";
    game.execute<PlayerBet, playerBet.Options>(playerBet.command, {
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
      game.execute<PlayerBet, playerBet.Options>(playerBet.command, {
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
