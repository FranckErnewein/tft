import { StateMachine, Player, RoundResult, RoundStatus } from "../state";
import { DEFAULT_PLAYER_BALANCE } from "../constants";
// import { GameError } from "../errors";
import { GameStarted, PlayerJoined, RoundStarted, PlayerBet } from "../events";
import startGame from "./startGame";
import playerJoin, { Options as PlayerJoinOptions } from "./playerJoin";
import startRound from "./startRound";
import playerBet, { Options as PlayerBetOptions } from "./playerBet";
import endRound from "./endRound";

describe("endRound", () => {
  let game = new StateMachine();
  let p1: Player | null = null;
  let p2: Player | null = null;
  let p3: Player | null = null;
  beforeEach(() => {
    game = new StateMachine();
    game.execute<GameStarted>(startGame);
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
    game.execute<RoundStarted>(startRound);
  });

  it("end round with no bet, just archive last round", () => {
    game.execute(endRound, { roundResult: RoundResult.ANSWER_A });
    expect(game.state.currentRound).toBeNull();
    expect(game.state.pastRounds).toHaveLength(1);
    expect(game.state.pastRounds[0]?.endedAt).not.toBeNull();
    expect(game.state.pastRounds[0]?.result).toBe(RoundResult.ANSWER_A);
    expect(game.state.pastRounds[0]?.status).toBe(RoundStatus.OVER);
  });

  it("should just retrieve money when only one player bet", () => {
    if (!p1) throw "player is missing for test";
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 200,
      forecast: RoundResult.ANSWER_A,
      playerId: p1.id,
    });
    game.execute(endRound, { roundResult: RoundResult.ANSWER_A });
    expect(game.state.players[p1.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE
    );
  });

  it.todo("should divide with euclidian division (no rest)");

  it("should just increase money for the winner (2 players)", () => {
    if (!p1 || !p2) throw "player is missing for test";
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 200,
      forecast: RoundResult.ANSWER_A,
      playerId: p1.id,
    });
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 300,
      forecast: RoundResult.ANSWER_B,
      playerId: p2.id,
    });
    game.execute(endRound, { roundResult: RoundResult.ANSWER_A });
    expect(game.state.players[p1.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE + 300
    );
    expect(game.state.players[p2.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE - 300
    );
  });

  it("should just retrieve money when everybody lose", () => {
    if (!p1 || !p2 || !p3) throw "player is missing for test";
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 200,
      forecast: RoundResult.ANSWER_B,
      playerId: p1.id,
    });
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 300,
      forecast: RoundResult.ANSWER_B,
      playerId: p2.id,
    });
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 400,
      forecast: RoundResult.ANSWER_B,
      playerId: p3.id,
    });
    game.execute(endRound, { roundResult: RoundResult.ANSWER_A });
    expect(game.state.players[p1.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE
    );
    expect(game.state.players[p2.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE
    );
    expect(game.state.players[p3.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE
    );
  });

  it("should increase money with for the winner (3 players)", () => {
    if (!p1 || !p2 || !p3) throw "player is missing for test";
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 200,
      forecast: RoundResult.ANSWER_A,
      playerId: p1.id,
    });
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 300,
      forecast: RoundResult.ANSWER_B,
      playerId: p2.id,
    });
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 400,
      forecast: RoundResult.ANSWER_B,
      playerId: p3.id,
    });
    game.execute(endRound, { roundResult: RoundResult.ANSWER_A });
    expect(game.state.players[p1.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE + 700
    );
    expect(game.state.players[p2.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE - 300
    );
    expect(game.state.players[p3.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE - 400
    );
  });

  it("should increase money with odds the 2 winners (3 players)", () => {
    if (!p1 || !p2 || !p3) throw "player is missing for test";
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 100,
      forecast: RoundResult.ANSWER_A,
      playerId: p1.id,
    });
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 200,
      forecast: RoundResult.ANSWER_A,
      playerId: p2.id,
    });
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 600,
      forecast: RoundResult.ANSWER_B,
      playerId: p3.id,
    });
    game.execute(endRound, { roundResult: RoundResult.ANSWER_A });
    expect(game.state.players[p1.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE + 200
    );
    expect(game.state.players[p2.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE + 400
    );
    expect(game.state.players[p3.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE - 600
    );
  });

  it.todo("should not allow to end a round when there is no current round");
});
