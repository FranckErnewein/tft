import { Round, Bet } from "../types";

export function amountBet(round: Round) {
  const { result } = round;

  const total: number = Object.values(round.bets).reduce(
    (memo: number, bet: Bet) => bet.amountCents + memo,
    0
  );
  const byWinners: number = Object.values(round.bets).reduce(
    (memo: number, bet: Bet) =>
      (bet.expectedResult === result ? bet.amountCents : 0) + memo,
    0
  );
  const byLosers = total - byWinners;
  return {
    byWinners,
    byLosers,
  };
}

export function roundResultForPlayer(round: Round, playerId: string): number {
  const bet = round.bets[playerId];
  if (!bet) return 0;
  if (bet.expectedResult === round.result) {
    const { byLosers, byWinners } = amountBet(round);
    return byLosers * (bet.amountCents / byWinners);
  } else {
    return bet.amountCents * -1;
  }
}
