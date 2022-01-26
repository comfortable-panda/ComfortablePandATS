/**
 * @jest-environment jsdom
 */

import * as utils from "../utils";
import { Assignment, AssignmentEntry, CourseSiteInfo } from "../model";

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
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

describe("getDaysUntil()", (): void => {
  test("days: 0 <= x <= 1", (): void => {
    expect(utils.getDaysUntil(1634893200000, 1634911200000)).toBe("due24h");
  });
  test("days: 1 <= x <= 5", (): void => {
    expect(utils.getDaysUntil(1634893200000, 1635084000000)).toBe("due5d");
  });
  test("days: 5 <= x <= 14", (): void => {
    expect(utils.getDaysUntil(1634893200000, 1635498000000)).toBe("due14d");
  });
  test("days: 14 <= x", (): void => {
    expect(utils.getDaysUntil(1634893200000, 1638176400000)).toBe("dueOver14d");
  });
  test("days: 14 <= x", (): void => {
    expect(utils.getDaysUntil(1634893200000, 9999999990000)).toBe("dueOver14d");
  });
  test("days: x < 0", (): void => {
    expect(utils.getDaysUntil(1634893200000, -1000)).toBe("duePassed");
  });
  test("days: x < 0", (): void => {
    expect(utils.getDaysUntil(1634893200000, -1000)).not.toBe("due5d");
  });
});

// jest.mock("../utils", () => {
//   // 実際のモジュールを取得
//   const Utils = jest.requireActual("../utils");
//   return {
//     // モック化不要なものはそのまま
//     ...Utils,
//     // テスト対象のみ置き換える
//     getSiteCourseID: jest.fn().mockImplementation(() => {
//       return "keyClass";
//     }),
//   };
// });

describe("updateIsReadFlag()", (): void => {
  const sampleAssignmentEntry = new AssignmentEntry("id1", "title", 1000000, 100000, false, false, false);

  test("doesMatchCourseID", (): void => {
    const spyGetSiteCourseID = jest.spyOn(utils, "getSiteCourseID")
      .mockReturnValueOnce("59F7CE3C-5C9A-44A0-963B-E64C0D0A9109")
      .mockReturnValueOnce("EC6C945C-BBCC-4B84-9A89-06C3FFF3DFA1")
      .mockReturnValueOnce("FC0DDCE7-EFE5-446A-A928-A4857A7C63A8");
    const inputAssignmentList = [
      new Assignment(
        new CourseSiteInfo("59F7CE3C-5C9A-44A0-963B-E64C0D0A9109", "course1"),
        [sampleAssignmentEntry],
        false
      ),
      new Assignment(
        new CourseSiteInfo("EC6C945C-BBCC-4B84-9A89-06C3FFF3DFA1", "course1"),
        [sampleAssignmentEntry],
        false
      ),
    ];

    const expectAssignmentList = [
      new Assignment(
        new CourseSiteInfo("59F7CE3C-5C9A-44A0-963B-E64C0D0A9109", "course1"),
        [sampleAssignmentEntry],
        true
      ),
      new Assignment(
        new CourseSiteInfo("EC6C945C-BBCC-4B84-9A89-06C3FFF3DFA1", "course1"),
        [sampleAssignmentEntry],
        false
      ),
    ];

    let result = utils.updateIsReadFlag(inputAssignmentList);
    expect(result).toStrictEqual(expectAssignmentList);
    expect(spyGetSiteCourseID).toBeCalledTimes(1);

    result = utils.updateIsReadFlag(inputAssignmentList);
    expectAssignmentList[0].isRead = false;
    expectAssignmentList[1].isRead = true;
    expect(result).toStrictEqual(expectAssignmentList);
    expect(spyGetSiteCourseID).toBeCalledTimes(2);

    result = utils.updateIsReadFlag(inputAssignmentList);
    expectAssignmentList[0].isRead = false;
    expectAssignmentList[1].isRead = false;
    expect(result).toStrictEqual(expectAssignmentList);
    expect(spyGetSiteCourseID).toBeCalledTimes(3);
  });
});
