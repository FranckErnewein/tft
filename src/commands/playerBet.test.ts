import { StateMachine, Player, RoundResult } from "../state";
import { GameError } from "../errors";
import { DEFAULT_PLAYER_BALANCE } from "../constants";
import {
  GameStarted,
  PlayerJoined,
  RoundStarted,
  PlayerBet,
  PlayerLeft,
} from "../events";
import startGame from "./startGame";
import playerJoin, { Options as PlayerJoinOptions } from "./playerJoin";
import startRound from "./startRound";
import playerBet, { Options as PlayerBetOptions } from "./playerBet";
import playerLeave, { Options as PlayerLeaveOptions } from "./playerLeave";

describe("playerBet", () => {
  let game = new StateMachine();
  let player: Player | null = null;
  beforeEach(() => {
    game = new StateMachine();
    game.execute<GameStarted>(startGame);
    const event = game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
      playerName: "Franck",
    });
    player = event.payload.player;
    game.execute<RoundStarted>(startRound);
  });
  it("should bet: create a new bet and reduce player balance", () => {
    if (!player) throw "player not found";
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 200,
      forecast: RoundResult.ANSWER_A,
      playerId: player.id,
    });
    expect(game.state.currentRound?.bets[player.id].amountCents).toBe(200);
    expect(game.state.currentRound?.bets[player.id].expectedResult).toBe(
      RoundResult.ANSWER_A
    );
    expect(game.state.players[player.id]?.balanceCents).toBe(800);
  });

  it("should reject bet amount is superior to player's balance", () => {
    expect(() => {
      if (!player) throw "player not found";
      game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
        amountCents: 1200,
        forecast: RoundResult.ANSWER_A,
        playerId: player.id,
      });
    }).toThrow(GameError);
  });

  it("should edit a bet", () => {
    if (!player) throw "player not found";
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 800,
      forecast: RoundResult.ANSWER_A,
      playerId: player.id,
    });
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 400,
      forecast: RoundResult.ANSWER_B,
      playerId: player.id,
    });
    expect(game.state.currentRound?.bets[player.id].amountCents).toBe(400);
    expect(game.state.currentRound?.bets[player.id].expectedResult).toBe(
      RoundResult.ANSWER_B
    );
    expect(game.state.players[player.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE - 400
    );
  });

  it("should reject bet when amount is 0", () => {
    expect(() => {
      if (!player) return;
      game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
        amountCents: 0,
        forecast: RoundResult.ANSWER_A,
        playerId: player.id,
      });
    }).toThrow(GameError);
  });

  it("should reject bet because game is not in bet phase", () => {
    game.execute<GameStarted>(startGame); //reset game
    const event = game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
      playerName: "Franck",
    });
    player = event.payload.player;
    //avoid startBet command
    const t = () => {
      if (!player) throw "player not found";
      game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
        amountCents: 200,
        forecast: RoundResult.ANSWER_A,
        playerId: player.id,
      });
    };
    expect(t).toThrow(GameError);
    expect(t).toThrow("you can not bet yet");
  });

  it("should reject bet playerId was not found", () => {
    if (!player) throw "player not found";
    game.execute<PlayerLeft, PlayerLeaveOptions>(playerLeave, {
      playerId: player.id,
    });
    const t = () => {
      if (!player) throw "player not found";
      game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
        amountCents: 200,
        forecast: RoundResult.ANSWER_A,
        playerId: player.id,
      });
    };
    expect(t).toThrow(GameError);
    expect(t).toThrow("player not found");
  });
});
