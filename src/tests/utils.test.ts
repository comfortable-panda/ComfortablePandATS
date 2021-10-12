import { getDaysUntil } from "../utils";

// Declare toBeWithinRange as global method.
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(a: number, b: number): R;
    }
  }
}

// Declare toBeWithinRange method.
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

describe("getDaysUntil()", (): void => {
  test("days: 0 <= x <= 1", (): void => {
    expect(getDaysUntil(1634893200000, 1634911200000)).toBeWithinRange(0, 1);
  });
  test("days: 1 <= x <= 5", (): void => {
    expect(getDaysUntil(1634893200000, 1635084000000)).toBeWithinRange(1, 5);
  });
  test("days: 5 <= x <= 14", (): void => {
    expect(getDaysUntil(1634893200000, 1635498000000)).toBeWithinRange(5, 14);
  });
  test("days: 14 <= x", (): void => {
    expect(getDaysUntil(1634893200000, 1638176400000)).toBeWithinRange(14, 100);
  });
});
