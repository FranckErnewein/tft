import Play from "../components/Play";
import { Game, RoundStatus, RoundResult } from "../state";

export default function Betting() {
  const game: Game = {
    id: "59720d39-1a85-4cf3-93dd-efe67e74865f",
    startedAt: "2023-02-03T08:21:57.016Z",
    endedAt: null,
    players: {
      a: {
        id: "a",
        name: "Franck",
        balanceCents: 1000,
      },
      b: {
        id: "b",
        name: "Tehcata",
        balanceCents: 1000,
      },
      c: {
        id: "c",
        name: "Sofyan",
        balanceCents: 980,
      },
      d: {
        id: "d",
        name: "Gabibi",
        balanceCents: 980,
      },
      e: {
        id: "e",
        name: "Grosbibi",
        balanceCents: 980,
      },
      f: {
        id: "f",
        name: "bpk",
        balanceCents: 980,
      },
      g: {
        id: "g",
        name: "Le Grand Goundar",
        balanceCents: 1080,
      },
    },
    currentRound: {
      id: "06a451a0-050a-4c7b-a515-49d93299c2aa",
      startedAt: "2023-02-03T08:23:29.553Z",
      endedAt: null,
      status: RoundStatus.BET_TIME,
      betEndTimer: 5,
      result: null,
      bets: {
        b: {
          amountCents: 130,
          expectedResult: RoundResult.LOSE,
        },
        c: {
          amountCents: 200,
          expectedResult: RoundResult.WIN,
        },
        d: {
          amountCents: 550,
          expectedResult: RoundResult.WIN,
        },
        f: {
          amountCents: 50,
          expectedResult: RoundResult.LOSE,
        },
      },
    },
    pastRounds: [],
  };
  return <Play game={game} />;
}
