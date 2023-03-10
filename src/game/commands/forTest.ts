import * as commands from "./";
import { createEventStore, createStateStore } from "../../stores/inMemory";
import { pipeCommand, pipeAsyncCommand } from "../../pipes";

const { save, load } = createStateStore();

const commandForTest = Object.keys(commands).reduce((memo, commandName) => {
  const command = commands[commandName];
  if (command) {
    memo[commandName];
  }
}, {});
