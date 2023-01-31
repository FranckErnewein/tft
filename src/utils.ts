import Ajv from "ajv/dist/jtd";
import { DefinedError } from "ajv";
import { CommandOptionError } from "./errors";

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
