import { Round, Bet } from "../state";

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
    total,
    byWinners,
    byLosers,
  };
}
