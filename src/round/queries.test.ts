import { RoundResult, RoundStatus } from "../state";
import { roundResultForPlayer } from "./queries";

const defaultRound = {
  id: "28d6e889-4f85-4374-97e8-8d91de0294fe",
  startedAt: "2023-02-14T16:56:03.168Z",
  endedAt: "2023-02-14T17:07:03.798Z",
  status: RoundStatus.OVER,
  betEndTimer: 0,
  result: RoundResult.WIN,
  bets: {},
};

describe("roundResultForPlayer", () => {
  it("should say return 0 because no bet", () => {
    const round = { ...defaultRound };
    expect(roundResultForPlayer(round, "a")).toBe(0);
  });

  it("should say return 0 because no bet for this player", () => {
    const round = {
      ...defaultRound,
      bets: {
        b: {
          amountCents: 100,
          expectedResult: RoundResult.WIN,
        },
      },
    };
    expect(roundResultForPlayer(round, "a")).toBe(0);
  });

  it("should say return 0 because is the only one to win", () => {
    const round = {
      ...defaultRound,
      bets: {
        a: {
          amountCents: 100,
          expectedResult: RoundResult.WIN,
        },
      },
    };
    expect(roundResultForPlayer(round, "a")).toBe(0);
  });

  it("should say return 100 because player win over one guy", () => {
    const round = {
      ...defaultRound,
      bets: {
        a: {
          amountCents: 100,
          expectedResult: RoundResult.WIN,
        },
        b: {
          amountCents: 100,
          expectedResult: RoundResult.LOSE,
        },
      },
    };
    expect(roundResultForPlayer(round, "a")).toBe(100);
  });

  it("should say return 50 because player with another one win over one guy", () => {
    const round = {
      ...defaultRound,
      bets: {
        a: {
          amountCents: 100,
          expectedResult: RoundResult.WIN,
        },
        b: {
          amountCents: 100,
          expectedResult: RoundResult.WIN,
        },
        c: {
          amountCents: 100,
          expectedResult: RoundResult.LOSE,
        },
      },
    };
    expect(roundResultForPlayer(round, "a")).toBe(50);
  });

  it("should say return 200 because player win over 2 guys", () => {
    const round = {
      ...defaultRound,
      bets: {
        a: {
          amountCents: 100,
          expectedResult: RoundResult.WIN,
        },
        b: {
          amountCents: 100,
          expectedResult: RoundResult.LOSE,
        },
        c: {
          amountCents: 100,
          expectedResult: RoundResult.LOSE,
        },
      },
    };
    expect(roundResultForPlayer(round, "a")).toBe(200);
  });

  it("should return -100 because player lose over 2 guys", () => {
    const round = {
      ...defaultRound,
      bets: {
        a: {
          amountCents: 100,
          expectedResult: RoundResult.LOSE,
        },
        b: {
          amountCents: 100,
          expectedResult: RoundResult.WIN,
        },
        c: {
          amountCents: 100,
          expectedResult: RoundResult.WIN,
        },
      },
    };
    expect(roundResultForPlayer(round, "a")).toBe(-100);
  });
});
