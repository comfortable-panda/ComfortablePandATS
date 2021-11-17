/**
 * @jest-environment jsdom
 */
import { getAssignmentByCourseID } from "../network";
import fs from "fs";
import { Assignment, AssignmentEntry, CourseSiteInfo } from "../model";

describe("testapi()", (): void => {
  beforeEach(() => {
    //@ts-ignore
    fetch.resetMocks();
  });

  test("api", async (): Promise<void> => {
    const jsonObject = JSON.parse(fs.readFileSync(`./src/tests/resources/assignment1.json`, "utf8"));
    //@ts-ignore
    fetch.mockResponseOnce(JSON.stringify(jsonObject));
    const a = await getAssignmentByCourseID("", "");
    const assignmentEntry = new AssignmentEntry("sample1","Sample Assignment1",1668006000, 1668006000, false, false,false);
    assignmentEntry.assignmentDetail = "--------";
    assignmentEntry.assignmentPage = "/portal/site/";
    const assignment = new Assignment(new CourseSiteInfo("", ""), [assignmentEntry], false);

    expect(a).toEqual(assignment);

    // expect(await getAssignmentByCourseID("", "")).toBe("");
  });
});