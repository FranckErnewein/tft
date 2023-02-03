import { v4 as uuid } from "uuid";
import { JTDDataType } from "ajv/dist/jtd";
import { Command } from "./types";
import { EventType, PlayerJoined } from "../events";
import { GameError } from "../errors";
import { timestamp, createValidator } from "../utils";

const schema = {
  properties: {
    playerName: { type: "string" },
  },
} as const;

export type Options = JTDDataType<typeof schema>;
const validate = createValidator<Options>(schema);

const playerJoin: Command<Options> = (game, options): PlayerJoined => {
  validate(options);
  Object.keys(game.players)
    .map((playerId) => game.players[playerId])
    .forEach((player) => {
      if (player && player.name === options.playerName)
        throw new GameError("name already used");
    });
  return {
    type: EventType.PLAYER_JOINED,
    datetime: timestamp(),
    payload: {
      player: {
        id: uuid(),
        name: options.playerName,
        balanceCents: 1000,
      },
    },
  };
};

export default playerJoin;
