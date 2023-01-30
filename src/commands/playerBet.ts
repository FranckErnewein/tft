import { JTDDataType } from "ajv/dist/jtd";
import { RoundResult } from "../state";
import { Command } from "./types";
import { EventType, PlayerBet } from "../events";
import { GameError } from "../errors";
import { timestamp, ajv } from "../utils";

const Schema = {
  properties: {
    amountCents: { type: "uint16" },
    win: { type: "boolean" },
    playerId: { type: "string" },
  },
} as const;

export type Options = JTDDataType<typeof Schema>;
export const Validator = ajv.compile<Options>(Schema);

export const command: Command<PlayerBet, Options> = (state, options) => {
  if (state.players[options.playerId]?.balanceCents < options.amountCents) {
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
        expectedResult: options.win ? RoundResult.WIN : RoundResult.LOSE,
      },
    },
  };
};
