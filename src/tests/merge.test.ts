/**
 * @jest-environment jsdom
 */

import { Assignment, AssignmentEntry } from "../features/entity/assignment/types";
import { Course } from "../features/course/types";
import { mockAssignmentEntry } from "./mock/generator";
import { mergeEntities, mergeEntries } from "../features/merge";
import _ from "lodash";

const mockVersion = jest.fn();
jest.mock("../constant", () => ({
    get VERSION() {
        return mockVersion();
    },
}));

describe("Asssignment", () => {
  test("Has no old assignment", () => {
    const oldAssignments: Array<Assignment> = [];
    const newAssignments = [
      new Assignment(
        new Course("course1", "course1", ""),
        [
          mockAssignmentEntry("a1", 100, 100, false),
          mockAssignmentEntry("a2", 200, 200, false),
          mockAssignmentEntry("a3", 300, 300, false),
          mockAssignmentEntry("a4", 100, 100, false),
        ],
        false
      ),
    ];
    const expectAssignments = _.cloneDeep(newAssignments);
    const mergedAssignments = mergeEntities<Assignment>(oldAssignments, newAssignments);
    expect(mergedAssignments).toStrictEqual(expectAssignments);
  });

  test("Old assignment with few entry", () => {
    const oldAssignments = [
      new Assignment(
        new Course("course1", "course1", ""),
        [
          mockAssignmentEntry("a2", 200, 200, false),
          mockAssignmentEntry("a4", 100, 100, false),
        ],
        false
      ),
    ];

    const newAssignments = [
      new Assignment(
        new Course("course1", "course1", ""),
        [
          mockAssignmentEntry("a1", 100, 100, false),
          mockAssignmentEntry("a2", 200, 200, false),
          mockAssignmentEntry("a3", 300, 300, false),
          mockAssignmentEntry("a4", 100, 100, false),
        ],
        false
      ),
    ];
    const expectAssignments = _.cloneDeep(newAssignments);
    const mergedAssignments = mergeEntities<Assignment>(oldAssignments, newAssignments);
    expect(mergedAssignments).toStrictEqual(expectAssignments);
  });

  test("Old assignment with finished entries", () => {
    const oldAssignments = [
      new Assignment(
        new Course("course1", "course1", ""),
        [
          mockAssignmentEntry("a1", 100, 100, false),
          mockAssignmentEntry("a2", 200, 200, true),
          mockAssignmentEntry("a3", 300, 300, true),
        ],
        false
      ),
    ];

    const newAssignments = [
      new Assignment(
        new Course("course1", "course1", ""),
        [
          mockAssignmentEntry("a1", 100, 100, false),
          mockAssignmentEntry("a2", 200, 200, false),
          mockAssignmentEntry("a3", 300, 300, false),
          mockAssignmentEntry("a4", 100, 100, false),
        ],
        false
      ),
    ];
    const expectAssignments = [
      new Assignment(
        new Course("course1", "course1", ""),
        [
          mockAssignmentEntry("a1", 100, 100, false),
          mockAssignmentEntry("a2", 200, 200, true),
          mockAssignmentEntry("a3", 300, 300, true),
          mockAssignmentEntry("a4", 100, 100, false),
        ],
        false
      ),
    ];
    const mergedAssignments = mergeEntities<Assignment>(oldAssignments, newAssignments);
    expect(mergedAssignments).toStrictEqual(expectAssignments);
  });

  test("Old assignment with old dueTime & closeTime", () => {
    const oldAssignments = [
      new Assignment(
        new Course("course1", "course1", ""),
        [
          mockAssignmentEntry("a1", 100, 100, false),
          mockAssignmentEntry("a2", 100, 100, true),
          mockAssignmentEntry("a3", 100, 100, true),
        ],
        false
      ),
    ];

    const newAssignments = [
      new Assignment(
        new Course("course1", "course1", ""),
        [
          mockAssignmentEntry("a1", 100, 100, false),
          mockAssignmentEntry("a2", 200, 200, false),
          mockAssignmentEntry("a3", 300, 300, false),
          mockAssignmentEntry("a4", 100, 100, false),
        ],
        false
      ),
    ];
    const expectAssignments = [
      new Assignment(
        new Course("course1", "course1", ""),
        [
          mockAssignmentEntry("a1", 100, 100, false),
          mockAssignmentEntry("a2", 200, 200, true),
          mockAssignmentEntry("a3", 300, 300, true),
          mockAssignmentEntry("a4", 100, 100, false),
        ],
        false
      ),
    ];
    const mergedAssignments = mergeEntities<Assignment>(oldAssignments, newAssignments);
    expect(mergedAssignments).toStrictEqual(expectAssignments);
  });

  test("Old assignments + misc", () => {
    const oldAssignments = [
      new Assignment(
        new Course("course1", "course1", ""),
        [
          mockAssignmentEntry("a1", 100, 100, false),
          mockAssignmentEntry("a2", 100, 100, true),
          mockAssignmentEntry("a3", 100, 100, true),
          mockAssignmentEntry("a4", 100, 100, true),
        ],
        false
      ),
      new Assignment(
        new Course("course2", "course1", ""),
        [
          mockAssignmentEntry("a1", 100, 100, false),
          mockAssignmentEntry("a2", 100, 100, true),
          mockAssignmentEntry("a3", 100, 100, true),
          mockAssignmentEntry("a4", 100, 100, true),
        ],
        false
      ),
    ];

    const newAssignments = [
      new Assignment(
        new Course("course1", "course1", ""),
        [
          mockAssignmentEntry("a1", 50, 100, false),
          mockAssignmentEntry("a2", 200, 200, false),
          mockAssignmentEntry("a3", 300, 300, false),
          mockAssignmentEntry("a4", 20, 10, false),
          mockAssignmentEntry("a5", 100, 100, false),
        ],
        false
      ),
    ];
    const expectAssignments = [
      new Assignment(
        new Course("course1", "course1", ""),
        [
          mockAssignmentEntry("a1", 50, 100, false),
          mockAssignmentEntry("a2", 200, 200, true),
          mockAssignmentEntry("a3", 300, 300, true),
          mockAssignmentEntry("a4", 20, 10, true),
          mockAssignmentEntry("a5", 100, 100, false),
        ],
        false
      ),
    ];
    const mergedAssignments = mergeEntities<Assignment>(oldAssignments, newAssignments);
    expect(mergedAssignments).toStrictEqual(expectAssignments);
  });

  test("Old assignments + misc2", () => {
    const oldAssignments = [
      new Assignment(
        new Course("course1", "course1", ""),
        [
          mockAssignmentEntry("a1", 100, 100, false),
          mockAssignmentEntry("a2", 100, 100, true),
          mockAssignmentEntry("a3", 100, 100, true),
          mockAssignmentEntry("a4", 100, 100, true),
        ],
        false
      ),
      new Assignment(
        new Course("course2", "course1", ""),
        [
          mockAssignmentEntry("a1", 200, 200, false),
          mockAssignmentEntry("a2", 200, 200, true),
          mockAssignmentEntry("a3", 200, 200, false),
          mockAssignmentEntry("a4", 200, 200, true),
        ],
        false
      ),
    ];

    const newAssignments = [
      new Assignment(
        new Course("course1", "course1", ""),
        [
          mockAssignmentEntry("a1", 100, 100, false),
          mockAssignmentEntry("a2", 100, 100, false),
          mockAssignmentEntry("a3", 100, 100, false),
        ],
        false
      ),
      new Assignment(
        new Course("course2", "course1", ""),
        [
          mockAssignmentEntry("a1", 200, 200, false),
          mockAssignmentEntry("a2", 200, 200, false),
          mockAssignmentEntry("a3", 200, 200, false),
          mockAssignmentEntry("a4", 200, 200, false),
          mockAssignmentEntry("b5", 100, 200, false),
        ],
        false
      ),
    ];
    const expectAssignments = [
      new Assignment(
        new Course("course1", "course1", ""),
        [
          mockAssignmentEntry("a1", 100, 100, false),
          mockAssignmentEntry("a2", 100, 100, true),
          mockAssignmentEntry("a3", 100, 100, true),
        ],
        false
      ),
      new Assignment(
        new Course("course2", "course1", ""),
        [
          mockAssignmentEntry("a1", 200, 200, false),
          mockAssignmentEntry("a2", 200, 200, true),
          mockAssignmentEntry("a3", 200, 200, false),
          mockAssignmentEntry("a4", 200, 200, true),
          mockAssignmentEntry("b5", 100, 200, false),
        ],
        false
      ),
    ];
    const mergedAssignments = mergeEntities<Assignment>(oldAssignments, newAssignments);
    expect(mergedAssignments).toStrictEqual(expectAssignments);
  });
});
