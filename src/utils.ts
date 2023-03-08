import Ajv from "ajv/dist/jtd";
import { DefinedError } from "ajv";
import { CommandOptionError } from "./errors";

export function promisify<T, U>(func: (x: T) => U): (x: T) => Promise<U> {
  return function (x: T): Promise<U> {
    return Promise.resolve(func(x));
  };
}

export function asFunction<T>(x: T): (...args: any[]) => T {
  return () => x;
}

export function identity<T>(): (x: T) => T {
  return (x) => x;
}

export function timestamp(d = new Date()): string {
  return d.toISOString();
}

export const ajv = new Ajv();
export function createValidator<O>(schema: any): (options: unknown) => void {
  const validate = ajv.compile<O>(schema);
  return function (options: unknown) {
    const isValid = validate(options);
    if (!isValid && validate.errors) {
      throw new CommandOptionError(validate.errors as DefinedError[]);
    }
  };
}

export function displayAmount(amountCts: number): string {
  let str = (Math.round(amountCts) / 100).toString();
  const digits = str.split(".")[1];
  if (digits && digits.length === 1) {
    str += "0";
  }
  str += "€";
  return str;
}
