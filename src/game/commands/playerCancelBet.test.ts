import { StateMachine, Player, RoundResult } from "../state";
import { DEFAULT_PLAYER_BALANCE } from "../constants";
import {
  GameStarted,
  PlayerJoined,
  RoundStarted,
  PlayerBet,
  PlayerCancelBet,
} from "../events";
import startGame from "./startGame";
import playerJoin, { Options as PlayerJoinOptions } from "./playerJoin";
import startRound from "./startRound";
import playerBet, { Options as PlayerBetOptions } from "./playerBet";
import playerCancelBet, {
  Options as PlayerCancelBetOptions,
} from "./playerCancelBet";

describe("playerCancelBet", () => {
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
    game.execute<PlayerBet, PlayerBetOptions>(playerBet, {
      amountCents: 200,
      forecast: RoundResult.ANSWER_A,
      playerId: player.id,
    });
  });

  it("should cancel a bet and refound player", () => {
    if (!player) throw "player not found";
    if (!game.state.currentRound) throw "round not running";
    game.execute<PlayerCancelBet, PlayerCancelBetOptions>(playerCancelBet, {
      playerId: player.id,
    });
    expect(game.state.players[player.id]?.balanceCents).toBe(
      DEFAULT_PLAYER_BALANCE
    );
    expect(game.state.currentRound.bets[player.id]).toBeUndefined();
  });

  it.todo("should not allow to cancel a bet when it does not exist");
  it.todo("should throw when user do not exists");
});
