import { Game } from "./types";

const defaultGame: Game = {
  id: "",
  startedAt: null,
  endedAt: null,
  players: {},
  currentRound: null,
  pastRounds: [],
};

export default defaultGame;
