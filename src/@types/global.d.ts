declare global {
  interface Game {
    id: string;
    startedAt: string;
    endedAt: string;
    players: Record<string, Player>;
    rounds: Round[];
  }

  enum RoundStatus {
    BetTime = "BET_TIME",
    Running = "RUNNING",
    Over = "OVER",
  }

  enum RoundResult {
    Win = "WIN",
    Lose = "LOSE",
  }

  interface Round {
    id: string;
    startedAt: string;
    endedAt: string;
    status: RoundStatus;
    betEndTimer: number;
    result: RoundResult | null;
    bets: Record<string, Bet>;
  }

  interface Player {
    id: string;
    name: string;
    balanceCents: number;
  }

  interface Bet {
    expectedResult: RoundResult;
    amountCents: number;
  }

  enum EventType {
    GAME_STARTED,
    PLAYER_JOINED,
    ROUND_STARTED,
    BET_TIME_STARTED,
    BET_TIME_DECREASED,
    BET_TIME_ENDED,
    PLAYER_BET,
    ROUND_OVER,
    GAME_OVER,
  }

  interface GameEvent {
    type: EventType;
  }

  // Event
  interface GameStated extends EventType {
    type: EventType.GAME_STARTED;
    gameId: string;
  }

  interface PlayerJoined extends EventType {
    type: EventType.PLAYER_JOINED;
    player: Player;
  }

  interface RoundStarted extends EventType {
    type: EventType.ROUND_STARTED;
    roundId: string;
  }

  interface BetTimeStarted extends EventType {
    type: EventType.BET_TIME_STARTED;
  }

  interface BetTimeDecreased extends EventType {
    type: EventType.BET_TIME_DECREASED;
    restingTime: number;
  }

  interface BetTimeEnded extends EventType {
    type: EventType.BET_TIME_ENDED;
  }

  interface PlayerBet extends EventType {
    type: EventType.PLAYER_BET;
    playerId: string;
    bet: Bet;
  }

  interface RoundOver extends EventType {
    type: EventType.ROUND_OVER;
  }

  interface GameOver extends EventType {
    type: EventType.GAME_OVER;
  }
}
