import * as commands from "./";
import { Game } from "../types";
import { GameEvent } from "../events";
import reducer from "../reducer";
import defaultState from "../defaultState";
import { createEventStore, createStateStore } from "../../stores/inMemory";
import { pipeCommand, pipeAsyncCommand } from "../../pipes";

const { save, load, reset: _reset } = createStateStore<Game>(defaultState);
const { append } = createEventStore<GameEvent>();

export const state = load("test");
export const reset = _reset("test");
const saveTestState = save("test");
const appendTestEvent = append("test");

export const startGame = pipeCommand<undefined, GameEvent, Game>(
  state,
  commands.startGame.default,
  appendTestEvent,
  reducer,
  saveTestState
);

export const playerJoin = pipeCommand<
  commands.playerJoin.Options,
  GameEvent,
  Game
>(state, commands.playerJoin.default, appendTestEvent, reducer, saveTestState);

export const playerLeave = pipeCommand<
  commands.playerLeave.Options,
  GameEvent,
  Game
>(state, commands.playerLeave.default, appendTestEvent, reducer, saveTestState);

export const startRound = pipeCommand<
  commands.startRound.Options,
  GameEvent,
  Game
>(state, commands.startRound.default, appendTestEvent, reducer, saveTestState);

export const playerBet = pipeCommand<
  commands.playerBet.Options,
  GameEvent,
  Game
>(state, commands.playerBet.default, appendTestEvent, reducer, saveTestState);

export const playerCancelBet = pipeCommand<
  commands.playerCancelBet.Options,
  GameEvent,
  Game
>(
  state,
  commands.playerCancelBet.default,
  appendTestEvent,
  reducer,
  saveTestState
);

export const endBet = pipeCommand<undefined, GameEvent, Game>(
  state,
  commands.endBet.default,
  appendTestEvent,
  reducer,
  saveTestState
);

export const scheduleEndBet = pipeAsyncCommand<
  commands.scheduleEndBet.Options,
  GameEvent,
  Game
>(
  state,
  commands.scheduleEndBet.default,
  appendTestEvent,
  reducer,
  saveTestState
);

export const endRound = pipeCommand<commands.endRound.Options, GameEvent, Game>(
  state,
  commands.endRound.default,
  appendTestEvent,
  reducer,
  saveTestState
);
