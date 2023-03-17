import * as memory from "./inMemory";

interface DataForTest {
  name: string;
  age: number;
}

const defaultData: DataForTest = {
  name: "",
  age: 0,
};

describe("in memory", () => {
  describe("state store", () => {
    const { save, load } = memory.createStateStore<DataForTest>(defaultData);
    it("should save then load", async () => {
      await save("test")({ name: "John", age: 18 });
      const data = await load("test")();
      expect(data.name).toBe("John");
      expect(data.age).toBe(18);
    });
  });
});
