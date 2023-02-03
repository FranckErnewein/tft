import { StateMachine, Player, RoundResult } from "../state";
import { DEFAULT_PLAYER_BALANCE } from "../constants";
// import { GameError } from "../errors";
import {
  GameStarted,
  PlayerJoined,
  RoundStarted,
  BetTimeStarted,
  PlayerBet,
  RoundOver,
} from "../events";
import startGame from "./startGame";
import playerJoin, { Options as PlayerJoinOptions } from "./playerJoin";
import startRound from "./startRound";
import startBet from "./startBet";
import playerBet, { Options as PlayerBetOptions } from "./playerBet";
import endRound from "./endRound";

describe("endRound", () => {
  let game = new StateMachine();
  let p1: Player | null = null;
  let p2: Player | null = null;
  let p3: Player | null = null;
  beforeEach(() => {
    game = new StateMachine();
    game.execute<GameStarted>(startGame, {});
    const e1 = game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
      playerName: "P1",
    });
    p1 = e1.payload.player;
    const e2 = game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
      playerName: "P2",
    });
    p2 = e2.payload.player;
    const e3 = game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
      playerName: "P3",
    });
    p3 = e3.payload.player;
    game.execute<RoundStarted>(startRound, {});
    game.execute<BetTimeStarted>(startBet, {});
  });

  it("end round with no bet, just archive last round", () => {
    game.execute(endRound, { roundResult: RoundResult.WIN });
    expect(game.state.currentRound).toBeNull();
    expect(game.state.pastRounds).toHaveLength(1);
  });

  it.skip("should just retrieve money when only one player bet", () => {
    if (!p1) throw "player is missing for test";
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 200,
      forecast: RoundResult.WIN,
      playerId: p1.id,
    });
    game.execute(endRound, { roundResult: RoundResult.WIN });
    expect(game.state.players[p1.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE
    );
  });

  it.skip("should just increase money for the winner (2 players)", () => {
    if (!p1 || !p2) throw "player is missing for test";
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 200,
      forecast: RoundResult.WIN,
      playerId: p1.id,
    });
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 300,
      forecast: RoundResult.LOSE,
      playerId: p2.id,
    });
    game.execute(endRound, { roundResult: RoundResult.WIN });
    expect(game.state.players[p2.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE + 200
    );
  });

  it.todo("should not allow to end a round when there is no current round");
});
