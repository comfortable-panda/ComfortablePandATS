/**
 * @jest-environment jsdom
 */
import { getAssignmentByCourseID } from "../network";
import fs from "fs";
import { Assignment, AssignmentEntry, CourseSiteInfo } from "../model";
import * as utils from "../utils";

describe("Assignment", (): void => {
  beforeEach(() => {
    //@ts-ignore
    fetch.resetMocks();
  });

  test("assignmentNotClosed", async (): Promise<void> => {
    const jsonObject = JSON.parse(fs.readFileSync(`./src/tests/resources/assignment1.json`, "utf8"));
    //@ts-ignore
    fetch.mockResponseOnce(JSON.stringify(jsonObject));

    // mock time
    Object.defineProperty(utils, "nowTime", {
      value: 1668005000000,
    });
    const a = await getAssignmentByCourseID("", "");
    const assignmentEntry = new AssignmentEntry("sample1", "Sample Assignment1", 1668006000, 1668006000, false, false, false);
    assignmentEntry.assignmentDetail = "--------";
    assignmentEntry.assignmentPage = "/portal/site/";
    const assignment = new Assignment(new CourseSiteInfo("", ""), [assignmentEntry], false);
    expect(a).toEqual(assignment);
  });

  test("assignmentClosed", async (): Promise<void> => {
    const jsonObject = JSON.parse(fs.readFileSync(`./src/tests/resources/assignment1.json`, "utf8"));
    //@ts-ignore
    fetch.mockResponseOnce(JSON.stringify(jsonObject));

    // mock time
    Object.defineProperty(utils, "nowTime", {
      value: 1668007000000,
    });
    const a = await getAssignmentByCourseID("", "");
    const assignmentEntry = new AssignmentEntry("sample1", "Sample Assignment1", 1668006000, 1668006000, false, false, false);
    assignmentEntry.assignmentDetail = "--------";
    assignmentEntry.assignmentPage = "/portal/site/";
    const assignment = new Assignment(new CourseSiteInfo("", ""), [], false);
    expect(a).toEqual(assignment);
  });

  test("assignmentPassedDueButNotClosed", async (): Promise<void> => {
    const jsonObject = JSON.parse(fs.readFileSync(`./src/tests/resources/assignment2.json`, "utf8"));
    //@ts-ignore
    fetch.mockResponseOnce(JSON.stringify(jsonObject));

    // mock time
    Object.defineProperty(utils, "nowTime", {
      value: 1668007000000,
    });
    const a = await getAssignmentByCourseID("", "");
    const assignmentEntry = new AssignmentEntry("sample2", "Sample Assignment2", 1668006000, 1668008000, false, false, false);
    assignmentEntry.assignmentDetail = "--------";
    assignmentEntry.assignmentPage = "/portal/site/";
    const assignment = new Assignment(new CourseSiteInfo("", ""), [assignmentEntry], false);
    expect(a).toEqual(assignment);
  });
});
