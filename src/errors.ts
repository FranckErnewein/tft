export class GameError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, GameError.prototype);
  }

  toJSON() {
    return {
      message: this.message,
      stack:
        process?.env?.NODE_ENV !== "production" ? this.stack?.split("\n") : [],
    };
  }
}
