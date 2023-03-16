import { Player, RoundResult, RoundStatus } from "../types";
import { DEFAULT_PLAYER_BALANCE } from "../constants";
import {
  reset,
  startGame,
  playerJoin,
  startRound,
  playerBet,
  endRound,
} from "./forTest";

describe("endRound", () => {
  let p1: Player | null = null;
  let p2: Player | null = null;
  let p3: Player | null = null;
  beforeEach(async () => {
    await reset();
    await startGame({});
    const [_1, e1] = await playerJoin({ playerName: "P1" });
    const [_2, e2] = await playerJoin({ playerName: "P2" });
    const [_3, e3] = await playerJoin({ playerName: "P3" });
    p1 = e1.payload.player;
    p2 = e2.payload.player;
    p3 = e3.payload.player;
    await startRound({});
  });

  it("end round with no bet, just archive last round", async () => {
    const [state] = await endRound({ roundResult: RoundResult.ANSWER_A });
    expect(state.currentRound).toBeNull();
    expect(state.pastRounds).toHaveLength(1);
    expect(state.pastRounds[0]?.endedAt).not.toBeNull();
    expect(state.pastRounds[0]?.result).toBe(RoundResult.ANSWER_A);
    expect(state.pastRounds[0]?.status).toBe(RoundStatus.OVER);
  });

  it("should just retrieve money when only one player bet", async () => {
    if (!p1) throw "player is missing for test";
    playerBet({
      amountCents: 200,
      forecast: RoundResult.ANSWER_A,
      playerId: p1.id,
    });
    const [state] = await endRound({ roundResult: RoundResult.ANSWER_A });
    expect(state.players[p1.id]?.balanceCents).toBe(DEFAULT_PLAYER_BALANCE);
  });

  it.todo("should divide with euclidian division (no rest)");

  it("should just increase money for the winner (2 players)", async () => {
    if (!p1 || !p2) throw "player is missing for test";
    await playerBet({
      amountCents: 200,
      forecast: RoundResult.ANSWER_A,
      playerId: p1.id,
    });
    await playerBet({
      amountCents: 300,
      forecast: RoundResult.ANSWER_B,
      playerId: p2.id,
    });
    const [state] = await endRound({ roundResult: RoundResult.ANSWER_A });
    expect(state.players[p1.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE + 300
    );
    expect(state.players[p2.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE - 300
    );
  });

  it("should just retrieve money when everybody lose", async () => {
    if (!p1 || !p2 || !p3) throw "player is missing for test";
    await playerBet({
      amountCents: 200,
      forecast: RoundResult.ANSWER_B,
      playerId: p1.id,
    });
    await playerBet({
      amountCents: 300,
      forecast: RoundResult.ANSWER_B,
      playerId: p2.id,
    });
    await playerBet({
      amountCents: 400,
      forecast: RoundResult.ANSWER_B,
      playerId: p3.id,
    });
    const [{ players }] = await endRound({ roundResult: RoundResult.ANSWER_A });
    expect(players[p1.id]?.balanceCents).toBe(DEFAULT_PLAYER_BALANCE);
    expect(players[p2.id]?.balanceCents).toBe(DEFAULT_PLAYER_BALANCE);
    expect(players[p3.id]?.balanceCents).toBe(DEFAULT_PLAYER_BALANCE);
  });

  it("should increase money with for the winner (3 players)", async () => {
    if (!p1 || !p2 || !p3) throw "player is missing for test";
    await playerBet({
      amountCents: 200,
      forecast: RoundResult.ANSWER_A,
      playerId: p1.id,
    });
    await playerBet({
      amountCents: 300,
      forecast: RoundResult.ANSWER_B,
      playerId: p2.id,
    });
    await playerBet({
      amountCents: 400,
      forecast: RoundResult.ANSWER_B,
      playerId: p3.id,
    });
    const [{ players }] = await endRound({ roundResult: RoundResult.ANSWER_A });
    expect(players[p1.id]?.balanceCents).toBe(DEFAULT_PLAYER_BALANCE + 700);
    expect(players[p2.id]?.balanceCents).toBe(DEFAULT_PLAYER_BALANCE - 300);
    expect(players[p3.id]?.balanceCents).toBe(DEFAULT_PLAYER_BALANCE - 400);
  });

  it("should increase money with odds the 2 winners (3 players)", async () => {
    if (!p1 || !p2 || !p3) throw "player is missing for test";
    await playerBet({
      amountCents: 100,
      forecast: RoundResult.ANSWER_A,
      playerId: p1.id,
    });
    await playerBet({
      amountCents: 200,
      forecast: RoundResult.ANSWER_A,
      playerId: p2.id,
    });
    await playerBet({
      amountCents: 600,
      forecast: RoundResult.ANSWER_B,
      playerId: p3.id,
    });
    const [{ players }] = await endRound({ roundResult: RoundResult.ANSWER_A });
    expect(players[p1.id]?.balanceCents).toBe(DEFAULT_PLAYER_BALANCE + 200);
    expect(players[p2.id]?.balanceCents).toBe(DEFAULT_PLAYER_BALANCE + 400);
    expect(players[p3.id]?.balanceCents).toBe(DEFAULT_PLAYER_BALANCE - 600);
  });

  it.todo("should not allow to end a round when there is no current round");
});
