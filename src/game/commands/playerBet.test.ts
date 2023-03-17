import { Player, RoundResult } from "../types";
import { DEFAULT_PLAYER_BALANCE } from "../constants";
import { GameError } from "../errors";
import {
  reset,
  startGame,
  playerJoin,
  startRound,
  playerBet,
  playerLeave,
} from "./forTest";

describe("playerBet", () => {
  let player: Player | null = null;
  beforeEach(async () => {
    await reset();
    await startGame({});
    const [_, event] = await playerJoin({ playerName: "John" });
    player = event.payload.player;
    await startRound({});
  });

  it("should bet: create a new bet and reduce player balance", async () => {
    if (!player) throw "player not found";
    const [{ currentRound, players }] = await playerBet({
      amountCents: 200,
      forecast: RoundResult.ANSWER_A,
      playerId: player.id,
    });
    const bet = currentRound?.bets[player.id];
    expect(bet?.amountCents).toBe(200);
    expect(bet?.expectedResult).toBe(RoundResult.ANSWER_A);
    expect(players[player.id]?.balanceCents).toBe(800);
  });

  it("should reject bet amount is superior to player's balance", async () => {
    if (!player) throw "player not found";
    playerBet({
      amountCents: 1200,
      forecast: RoundResult.ANSWER_A,
      playerId: player.id,
    }).catch((e) => expect(e).toBeInstanceOf(GameError));
  });

  it("should edit a bet", async () => {
    if (!player) throw "player not found";
    await playerBet({
      amountCents: 800,
      forecast: RoundResult.ANSWER_A,
      playerId: player.id,
    });
    const [state] = await playerBet({
      amountCents: 400,
      forecast: RoundResult.ANSWER_B,
      playerId: player.id,
    });
    expect(state.currentRound?.bets[player.id].amountCents).toBe(400);
    expect(state.currentRound?.bets[player.id].expectedResult).toBe(
      RoundResult.ANSWER_B
    );
    expect(state.players[player.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE - 400
    );
  });

  it("should reject bet when amount is 0", () => {
    if (!player) throw "player not found";
    playerBet({
      amountCents: 0,
      forecast: RoundResult.ANSWER_A,
      playerId: player.id,
    }).catch((e) => expect(e).toBeInstanceOf(GameError));
  });

  it("should reject bet because game is not in bet phase", async () => {
    reset();
    await startGame({});
    const [_, event] = await playerJoin({ playerName: "Franck" });
    player = event.payload.player;
    try {
      await playerBet({
        amountCents: 200,
        forecast: RoundResult.ANSWER_A,
        playerId: player.id,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(GameError);
      expect(e).toHaveProperty("message", "you can not bet yet");
    }
  });

  it("should reject bet playerId was not found", async () => {
    if (!player) throw "player not found";
    await playerLeave({
      playerId: player.id,
    });
    try {
      await playerBet({
        amountCents: 200,
        forecast: RoundResult.ANSWER_A,
        playerId: player.id,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(GameError);
      expect(e).toHaveProperty("message", "player not found");
    }
  });
});
