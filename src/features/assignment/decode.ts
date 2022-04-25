import { Assignment, AssignmentEntry } from "./types";
import { nowTime } from "../../utils";
import { Course } from "../course/types";

/* Sakai APIから取得した課題をAssignmentEntryに変換する */
export const decodeAssignmentFromAPI = (data: Record<string, any>): Array<AssignmentEntry> => {
  return data.assignment_collection
    .filter((json: any) => json.closeTime.epochSecond * 1000 >= nowTime)
    .map((json: any) => {
      const entry = new AssignmentEntry(
        json.id,
        json.title,
        json.dueTime.epochSecond ? json.dueTime.epochSecond : null,
        json.closeTime.epochSecond ? json.closeTime.epochSecond : null,
        false,
      );
      return entry;
    });
};

export const decodeAssignmentFromArray = (data: Array<any>): Array<Assignment> => {
  const assignments: Array<Assignment> = [];
  if (typeof data === "undefined") return assignments;
  for (const assignment of data) {
    const course: Course = new Course(assignment.course.id, assignment.course.name);
    const isRead: boolean = assignment.isRead;
    const entries: Array<AssignmentEntry> = [];
    for (const e of assignment.entries) {
      const entry = new AssignmentEntry(e.id, e.title, e.dueTime, e.closeTime, e.hasFinished);
      if (entry.getCloseDateTimestamp * 1000 > nowTime) entries.push(entry);
    }
    assignments.push(new Assignment(course, entries, isRead));
  }
  return assignments;
};
