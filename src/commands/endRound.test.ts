import { StateMachine, Player, RoundResult } from "../state";
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
  let player1: Player | null = null;
  let player2: Player | null = null;
  let player3: Player | null = null;
  beforeEach(() => {
    game = new StateMachine();
    game.execute<GameStarted>(startGame, {});
    const e1 = game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
      playerName: "P1",
    });
    player1 = e1.payload.player;
    const e2 = game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
      playerName: "P2",
    });
    player2 = e2.payload.player;
    const e3 = game.execute<PlayerJoined, PlayerJoinOptions>(playerJoin, {
      playerName: "P3",
    });
    player3 = e3.payload.player;
    game.execute<RoundStarted>(startRound, {});
    game.execute<BetTimeStarted>(startBet, {});
  });

  it("end round with no bet, just archive last round", () => {
    game.execute(endRound, {});
    expect(game.state.currentRound).toBeNull();
    expect(game.state.pastRounds).toHaveLength(1);
  });

  it.todo("should not allow to end a round when there is no current round");
});
