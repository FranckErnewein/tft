import { JTDDataType } from "ajv/dist/jtd";
import { timestamp, createValidator } from "../../utils";
import { RoundResult, RoundStatus } from "../types";
import { GameCommand } from "../types";
import { EventType, PlayerBet } from "../events";
import { GameError } from "../errors";

const schema = {
  properties: {
    amountCents: { type: "uint16" },
    forecast: { enum: [RoundResult.ANSWER_A, RoundResult.ANSWER_B] },
    playerId: { type: "string" },
  },
} as const;

export type Options = JTDDataType<typeof schema>;
export const validate = createValidator<Options>(schema);

const playerBet: GameCommand<Options, PlayerBet> = (state, options) => {
  validate(options);
  if (
    !state.currentRound ||
    state.currentRound.status !== RoundStatus.BET_TIME
  ) {
    throw new GameError("you can not bet yet");
  }
  if (!state.players[options.playerId]) {
    throw new GameError(`player not found`);
  }
  if (options.amountCents === 0) {
    throw new GameError(`0 is not a valid amount for betting`);
  }
  const existingBetAmount =
    state.currentRound?.bets[options.playerId]?.amountCents || 0;
  if (
    state.players[options.playerId].balanceCents + existingBetAmount <
    options.amountCents
  ) {
    throw new GameError(
      `player has not enough money to bet ${options.amountCents}`
    );
  }
  return {
    type: EventType.PLAYER_BET,
    datetime: timestamp(),
    payload: {
      playerId: options.playerId,
      bet: {
        amountCents: options.amountCents,
        expectedResult: options.forecast,
      },
    },
  };
};

export default playerBet;
