/**
 * @jest-environment jsdom
 */

import * as utils from "../utils";
import { Assignment, AssignmentEntry, CourseSiteInfo } from "../model";
import _ from "lodash";

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

describe("updateIsReadFlag()", (): void => {
  const sampleAssignmentEntry = new AssignmentEntry("id1", "title", 1000000, 100000, false, false, false);
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
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("doesMatchCourseID", (): void => {
    const spyGetSiteCourseID = jest
      .spyOn(utils, "getSiteCourseID")
      .mockReturnValueOnce("59F7CE3C-5C9A-44A0-963B-E64C0D0A9109")
      .mockReturnValueOnce("EC6C945C-BBCC-4B84-9A89-06C3FFF3DFA1");

    let result = utils.updateIsReadFlag(inputAssignmentList);
    expect(result).toStrictEqual(expectAssignmentList);
    expect(spyGetSiteCourseID).toBeCalledTimes(1);

    result = utils.updateIsReadFlag(inputAssignmentList);
    expectAssignmentList[0].isRead = false;
    expectAssignmentList[1].isRead = true;
    expect(result).toStrictEqual(expectAssignmentList);
    expect(spyGetSiteCourseID).toBeCalledTimes(2);
  });

  test("doesNOTMatchCourseID", (): void => {
    const spyGetSiteCourseID = jest
      .spyOn(utils, "getSiteCourseID")
      .mockReturnValueOnce("FC0DDCE7-EFE5-446A-A928-A4857A7C63A8")
      .mockReturnValueOnce("")
      .mockReturnValueOnce(undefined);

    let result = utils.updateIsReadFlag(inputAssignmentList);
    expectAssignmentList[0].isRead = false;
    expectAssignmentList[1].isRead = false;
    expect(result).toStrictEqual(expectAssignmentList);
    expect(spyGetSiteCourseID).toBeCalledTimes(1);

    result = utils.updateIsReadFlag(inputAssignmentList);
    expect(result).toStrictEqual(expectAssignmentList);
    expect(spyGetSiteCourseID).toBeCalledTimes(2);

    result = utils.updateIsReadFlag(inputAssignmentList);
    expect(result).toStrictEqual(expectAssignmentList);
    expect(spyGetSiteCourseID).toBeCalledTimes(3);
  });

  test("alreadyIsRead", (): void => {
    const spyGetSiteCourseID = jest
      .spyOn(utils, "getSiteCourseID")
      .mockReturnValueOnce("59F7CE3C-5C9A-44A0-963B-E64C0D0A9109")
      .mockReturnValueOnce("EC6C945C-BBCC-4B84-9A89-06C3FFF3DFA1");

    inputAssignmentList[0].isRead = true;
    inputAssignmentList[1].isRead = true;

    let result = utils.updateIsReadFlag(inputAssignmentList);
    expectAssignmentList[0].isRead = true;
    expectAssignmentList[1].isRead = true;
    expect(result).toStrictEqual(expectAssignmentList);
    expect(spyGetSiteCourseID).toBeCalledTimes(1);

    result = utils.updateIsReadFlag(inputAssignmentList);
    expect(result).toStrictEqual(expectAssignmentList);
    expect(spyGetSiteCourseID).toBeCalledTimes(2);
  });
});

describe("compareAndMergeAssignmentList()", (): void => {
  const _oldAssignmentList = [
    new Assignment(
      new CourseSiteInfo("59F7CE3C-5C9A-44A0-963B-E64C0D0A9109", "course1"),
      [
        new AssignmentEntry("id1", "title", 1668611800, 1668611800, false, false, false),
        new AssignmentEntry("id2", "title2", 1668612800, 1668612800, false, false, false),
      ],
      false
    ),
    new Assignment(
      new CourseSiteInfo("EC6C945C-BBCC-4B84-9A89-06C3FFF3DFA1", "course2"),
      [
        new AssignmentEntry("id3", "title3", 1668613800, 1668613800, false, false, false)
      ],
      false
    ),
  ];
  const _newAssignmentList = [
    new Assignment(
      new CourseSiteInfo("59F7CE3C-5C9A-44A0-963B-E64C0D0A9109", "course1"),
      [
        new AssignmentEntry("id1", "title", 1668611800, 1668611800, false, false, false),
        new AssignmentEntry("id2", "title2", 1668612800, 1668612800, false, false, false),
      ],
      false
    ),
    new Assignment(
      new CourseSiteInfo("EC6C945C-BBCC-4B84-9A89-06C3FFF3DFA1", "course2"),
      [
        new AssignmentEntry("id3", "title3", 1668613800, 1668613800, false, false, false)
      ],
      false
    ),
  ];

  const _expectAssignmentList = [
    new Assignment(
      new CourseSiteInfo("59F7CE3C-5C9A-44A0-963B-E64C0D0A9109", "course1"),
      [
        new AssignmentEntry("id1", "title", 1668611800, 1668611800, false, false, false),
        new AssignmentEntry("id2", "title2", 1668612800, 1668612800, false, false, false),
      ],
      false
    ),
    new Assignment(
      new CourseSiteInfo("EC6C945C-BBCC-4B84-9A89-06C3FFF3DFA1", "course2"),
      [
        new AssignmentEntry("id3", "title3", 1668613800, 1668613800, false, false, false)
      ],
      false
    ),
  ];
  test("hasNoChange", (): void => {
    const oldAssignmentList = _.cloneDeep(_oldAssignmentList);
    const newAssignmentList = _.cloneDeep(_newAssignmentList);
    const expectAssignmentList = _.cloneDeep(_expectAssignmentList);
    expect(utils.compareAndMergeAssignmentList(oldAssignmentList, newAssignmentList)).toStrictEqual(expectAssignmentList);
  });

  test("hasANewAssignment", (): void => {
    const oldAssignmentList = _.cloneDeep(_oldAssignmentList);
    const newAssignmentList = _.cloneDeep(_newAssignmentList);
    const expectAssignmentList = _.cloneDeep(_expectAssignmentList);
    const newAssignmentEntry = new AssignmentEntry("id4", "title4", 1668613800, 1668613800, false, false, false);
    newAssignmentList[0].assignmentEntries.push(newAssignmentEntry);
    expectAssignmentList[0].assignmentEntries.push(newAssignmentEntry);

    expect(utils.compareAndMergeAssignmentList(oldAssignmentList, newAssignmentList)).toStrictEqual(expectAssignmentList);
  });

  test("hasUpdatesOnTitle", (): void => {
    const oldAssignmentList = _.cloneDeep(_oldAssignmentList);
    const newAssignmentList = _.cloneDeep(_newAssignmentList);
    const expectAssignmentList = _.cloneDeep(_expectAssignmentList);
    newAssignmentList[0].assignmentEntries[0].assignmentTitle = "new title1";
    newAssignmentList[1].assignmentEntries[0].assignmentTitle = "new title3";
    expectAssignmentList[0].assignmentEntries[0].assignmentTitle = "new title1";
    expectAssignmentList[1].assignmentEntries[0].assignmentTitle = "new title3";
    expect(utils.compareAndMergeAssignmentList(oldAssignmentList, newAssignmentList)).toStrictEqual(expectAssignmentList);
  });

  test("oldAssignments>newAssignments", (): void => {
    const oldAssignmentList = _.cloneDeep(_oldAssignmentList);
    const newAssignmentList = _.cloneDeep(_newAssignmentList);
    const expectAssignmentList = _.cloneDeep(_expectAssignmentList);
    const newAssignmentEntry = new AssignmentEntry("id4", "title4", 1668613800, 1668613800, false, false, false);
    oldAssignmentList[1].assignmentEntries.push(newAssignmentEntry);
    expect(utils.compareAndMergeAssignmentList(oldAssignmentList, newAssignmentList)).toStrictEqual(expectAssignmentList);
  });

  test("oldAssignments<newAssignments", (): void => {
    const oldAssignmentList = _.cloneDeep(_oldAssignmentList);
    const newAssignmentList = _.cloneDeep(_newAssignmentList);
    const expectAssignmentList = _.cloneDeep(_expectAssignmentList);
    const newAssignmentEntry = new AssignmentEntry("id4", "title4", 1668613800, 1668613800, false, false, false);
    newAssignmentList[1].assignmentEntries.push(newAssignmentEntry);
    expectAssignmentList[1].assignmentEntries.push(newAssignmentEntry);
    expect(utils.compareAndMergeAssignmentList(oldAssignmentList, newAssignmentList)).toStrictEqual(expectAssignmentList);
  });

  test("noOldAssignments", (): void => {
    const oldAssignmentList = _.cloneDeep(_oldAssignmentList);
    const newAssignmentList = _.cloneDeep(_newAssignmentList);
    const expectAssignmentList = _.cloneDeep(_expectAssignmentList);
    oldAssignmentList[0].assignmentEntries = [];
    oldAssignmentList[1].assignmentEntries = [];
    expect(utils.compareAndMergeAssignmentList(oldAssignmentList, newAssignmentList)).toStrictEqual(expectAssignmentList);
  });

  test("noNewAssignments", (): void => {
    const oldAssignmentList = _.cloneDeep(_oldAssignmentList);
    const newAssignmentList = _.cloneDeep(_newAssignmentList);
    const expectAssignmentList = _.cloneDeep(_expectAssignmentList);
    newAssignmentList[0].assignmentEntries = [];
    newAssignmentList[1].assignmentEntries = [];
    expectAssignmentList[0].assignmentEntries = [];
    expectAssignmentList[1].assignmentEntries = [];

    const result = utils.compareAndMergeAssignmentList(oldAssignmentList, newAssignmentList);
    expect(result[0].assignmentEntries).toStrictEqual(expectAssignmentList[0].assignmentEntries);
    expect(result[1].assignmentEntries).toStrictEqual(expectAssignmentList[1].assignmentEntries);
    expect(result[0].isRead).not.toBe(false);
    expect(result[1].isRead).toBe(true);
  });

  test("updateIsReadFlag", (): void => {
    const oldAssignmentList = _.cloneDeep(_oldAssignmentList);
    const newAssignmentList = _.cloneDeep(_newAssignmentList);
    const expectAssignmentList = _.cloneDeep(_expectAssignmentList);
    const newAssignmentEntry = new AssignmentEntry("id4", "title4", 1668613800, 1668613800, false, false, false);
    expectAssignmentList[0].isRead = true;
    newAssignmentList[0].assignmentEntries.push(newAssignmentEntry);
    expectAssignmentList[0].assignmentEntries.push(newAssignmentEntry);
    expect(utils.compareAndMergeAssignmentList(oldAssignmentList, newAssignmentList)[0].isRead).toBe(false);
  });

});
