import { StateStore } from "./types";
import * as memory from "./inMemory";
import * as redis from "./redis";

interface DataForTest {
  name: string;
  age: number;
}

const defaultData: DataForTest = {
  name: "",
  age: 0,
};

function testStateStore(store: StateStore<DataForTest>): void {
  const { save, load, reset } = store;
  it("should save then load", async () => {
    await save("test")({ name: "John", age: 18 });
    const data = await load("test")();
    expect(data.name).toBe("John");
    expect(data.age).toBe(18);
  });

  it("should save then, reset and load default", async () => {
    await save("test")({ name: "John", age: 18 });
    await reset("test")();
    const data = await load("test")();
    expect(data.name).toBe("");
    expect(data.age).toBe(0);
  });
}

describe("state store", () => {
  describe("in memory", () => {
    testStateStore(memory.createStateStore(defaultData));
  });

  describe("redis", () => {
    testStateStore(redis.createStateStore(defaultData));
    afterAll(async () => {
      await (await redis.getClient()).disconnect();
    });
  });
});
