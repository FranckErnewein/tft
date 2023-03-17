import { Player, RoundResult } from "../types";
import { DEFAULT_PLAYER_BALANCE } from "../constants";
import {
  reset,
  startGame,
  playerJoin,
  startRound,
  playerBet,
  playerCancelBet,
} from "./forTest";

describe("playerCancelBet", () => {
  let player: Player | null = null;
  beforeEach(async () => {
    await reset();
    await startGame({});
    const [_, event] = await playerJoin({ playerName: "John" });
    player = event.payload.player;
    await startRound({});
    await playerBet({
      amountCents: 200,
      forecast: RoundResult.ANSWER_A,
      playerId: player.id,
    });
  });

  it("should cancel a bet and refound player", async () => {
    if (!player) throw "player not found";
    const [state] = await playerCancelBet({ playerId: player.id });
    expect(state.players[player.id]?.balanceCents).toBe(DEFAULT_PLAYER_BALANCE);
    expect(state.currentRound).not.toBeNull();
    expect(state.currentRound?.bets[player.id]).toBeUndefined();
  });

  it.todo("should not allow to cancel a bet when it does not exist");
  it.todo("should throw when user do not exists");
});
