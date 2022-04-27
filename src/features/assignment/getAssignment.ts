import { Assignment } from "./types";
import { decodeAssignmentFromArray } from "./decode";
import { Course } from "../course/types";
import { fetchAssignment } from "../api/fetch";
import { fromStorage } from "../storage/load";
import { toStorage } from "../storage/save";
import { mergeEntities } from "../merge";

export const getSakaiAssignments = async (hostname: string, courses: Array<Course>): Promise<Array<Assignment>> => {
  const assignments: Array<Assignment> = [];
  const pending: Array<Promise<Assignment>> = [];
  for (const course of courses) {
    pending.push(fetchAssignment(course));
  }
  const result = await (Promise as any).allSettled(pending);
  for (const assignment of result) {
    if (assignment.status === "fulfilled") assignments.push(assignment.value);
  }
  await toStorage(hostname, "CS_AssignmentFetchTime", new Date().getTime());
  return assignments;
};

export const getStoredAssignments = (hostname: string): Promise<Array<Assignment>> => {
  return fromStorage<Array<Assignment>>(hostname, "CS_AssignmentList", decodeAssignmentFromArray);
};

export const getAssignments = async (hostname: string, courses: Array<Course>, useCache: boolean): Promise<Array<Assignment>> => {
  const sakaiAssignments = await getSakaiAssignments(hostname, courses);
  const storedAssignments = await getStoredAssignments(hostname);
  if (useCache) return storedAssignments;
  const merged = mergeEntities<Assignment>(storedAssignments, sakaiAssignments);
  await toStorage(hostname, "CS_AssignmentList", merged);
  return merged;
};
