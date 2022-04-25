import { Assignment } from "./types";
import { Course } from "../course/types";
import { fetchAssignment } from "../api/fetch";

export const getSakaiAssignments = async (courses: Array<Course>) => {
  const assignments: Array<Assignment> = [];
  const pending: Array<Promise<Assignment>> = [];
  for (const course of courses) {
    pending.push(fetchAssignment(course));
  }
  const result = await (Promise as any).allSettled(pending);
  for (const assignment of result) {
    if (assignment.status === "fulfilled") assignments.push(assignment.value);
  }
  return assignments;
};

// export const getStoredAssignments = () => {
//
// }
