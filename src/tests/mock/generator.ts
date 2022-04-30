import { Assignment, AssignmentEntry } from "../../features/entity/assignment/types";
import { Course } from "../../features/course/types";

export const mockCourse = (id: string): Course => {
  return new Course(id, id, "");
};

export const mockAssignmentEntry = (
  id: string,
  dueTime: number,
  closeTime: number,
  hasFinished: boolean
): AssignmentEntry => {
  return new AssignmentEntry(id, id, dueTime, closeTime, hasFinished);
};


