import { useState, useEffect } from "react";

import Play from "../components/Play";
import { Game, RoundStatus, RoundResult } from "../state";

const mock: Game = {
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
    betEndTimer: 20000,
    question: "win or lose ?",
    answerA: "win",
    answerB: "lose",
    result: null,
    bets: {
      b: {
        amountCents: 130,
        expectedResult: RoundResult.ANSWER_B,
      },
      c: {
        amountCents: 200,
        expectedResult: RoundResult.ANSWER_A,
      },
      d: {
        amountCents: 550,
        expectedResult: RoundResult.ANSWER_A,
      },
      f: {
        amountCents: 50,
        expectedResult: RoundResult.ANSWER_B,
      },
    },
  },
  pastRounds: [
    {
      id: "06a451a0-050a-4c7b-a515-49d93299c2aa",
      startedAt: "2023-02-03T08:23:29.553Z",
      endedAt: "2023-02-03T08:23:29.553Z",
      status: RoundStatus.OVER,
      betEndTimer: 0,
      result: RoundResult.ANSWER_A,
      question: "win or lose ?",
      answerA: "win",
      answerB: "lose",
      bets: {
        b: {
          amountCents: 130,
          expectedResult: RoundResult.ANSWER_B,
        },
        c: {
          amountCents: 200,
          expectedResult: RoundResult.ANSWER_A,
        },
        d: {
          amountCents: 150,
          expectedResult: RoundResult.ANSWER_A,
        },
        f: {
          amountCents: 50,
          expectedResult: RoundResult.ANSWER_B,
        },
      },
    },
    {
      id: "06a451a0-050a-4c7b-a515-49d93299c2aa",
      startedAt: "2023-02-03T08:23:29.553Z",
      endedAt: "2023-02-03T08:23:29.553Z",
      status: RoundStatus.OVER,
      betEndTimer: 0,
      result: RoundResult.ANSWER_A,

      question: "win or lose ?",
      answerA: "win",
      answerB: "lose",
      bets: {
        b: {
          amountCents: 130,
          expectedResult: RoundResult.ANSWER_B,
        },
        d: {
          amountCents: 150,
          expectedResult: RoundResult.ANSWER_A,
        },
        f: {
          amountCents: 50,
          expectedResult: RoundResult.ANSWER_B,
        },
      },
    },
    {
      id: "06a451a0-050a-4c7b-a515-49d93299c2aa",
      startedAt: "2023-02-03T08:23:29.553Z",
      endedAt: "2023-02-03T08:23:29.553Z",
      status: RoundStatus.OVER,
      betEndTimer: 0,
      result: RoundResult.ANSWER_B,
      question: "who will win ?",
      answerA: "pkayer 1",
      answerB: "pkayer 2",
      bets: {
        b: {
          amountCents: 130,
          expectedResult: RoundResult.ANSWER_B,
        },
        c: {
          amountCents: 200,
          expectedResult: RoundResult.ANSWER_A,
        },
        d: {
          amountCents: 150,
          expectedResult: RoundResult.ANSWER_A,
        },
        f: {
          amountCents: 50,
          expectedResult: RoundResult.ANSWER_B,
        },
      },
    },
  ],
};

export default function Betting() {
  const [game, setGame] = useState<Game>(mock);
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof game.currentRound?.betEndTimer === "number") {
        const newTimer = game.currentRound.betEndTimer - 1000;
        setGame({
          ...game,
          currentRound: {
            ...game.currentRound,
            betEndTimer: newTimer > -1 ? newTimer : 30000,
          },
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  });
  return <Play game={game} />;
}
