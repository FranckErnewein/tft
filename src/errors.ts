export class GameError extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, GameError.prototype);
  }
}
