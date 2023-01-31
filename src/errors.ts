import { DefinedError } from "ajv";

abstract class JSONableError extends Error {
  toJSON() {
    return {
      message: this.message,
      stack:
        process?.env?.NODE_ENV !== "production" ? this.stack?.split("\n") : [],
    };
  }
}

export class GameError extends JSONableError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, GameError.prototype);
  }
}

export class CommandOptionError extends JSONableError {
  errors: DefinedError[];

  constructor(validationErrors: DefinedError[]) {
    super("Command options validation errors");
    this.errors = validationErrors;
    Object.setPrototypeOf(this, CommandOptionError.prototype);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}
