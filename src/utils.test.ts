import { JTDDataType } from "ajv/dist/jtd";
import { createValidator } from "./utils";

const userSchema = {
  properties: {
    name: { type: "string" },
  },
};
type User = JTDDataType<typeof userSchema>;

const animalSchema = {
  properties: {
    name: { type: "string" },
  },
};
type Animal = JTDDataType<typeof animalSchema>;

const postSchema = {
  properties: {
    likes: { type: "uint8" },
  },
} as const;
type Post = JTDDataType<typeof postSchema>;

describe("utils", () => {
  describe("createValidator", () => {
    it("should compile a validator", () => {
      const validate = createValidator<User>(userSchema);
      expect(validate).toBeDefined();
    });

    it("should use validator the and success", () => {
      const validate = createValidator<User>(userSchema);
      expect(() => validate({ name: "John" })).not.toThrow();
    });
    it("should use the and throw because missing props", () => {
      const validate = createValidator<User>(userSchema);
      expect(() => validate({ notTheName: "bleh", legs: 4 })).toThrow();
    });
    it("should use the and throw because bad type", () => {
      const validate = createValidator<User>(userSchema);
      expect(() => validate({ name: true, legs: 4 })).toThrow();
    });

    it("should compile a 2nd validator and use it as well", () => {
      const validateAnimal = createValidator<Animal>(animalSchema);
      expect(() => validateAnimal({ legs: 4 })).toThrow();
      expect(() => validateAnimal({ name: "doggydog" })).not.toThrow();
    });

    it("should compile a validator with number", () => {
      const validatePost = createValidator<Post>(postSchema);
      expect(() => validatePost({ likes: 4 })).not.toThrow();
      expect(() => validatePost({ likes: false })).toThrow();
    });
  });
});
