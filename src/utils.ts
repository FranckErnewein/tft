import Ajv from "ajv/dist/jtd";

export function timestamp(d = new Date()): string {
  return d.toISOString();
}

export const ajv = new Ajv();
