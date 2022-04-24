import { Course } from "../course/types";

export type AssignmentEntry = {
  id: string;
  title: string;
  dueTime: number | null;
  closeTime: number | null;
  hasFinished: boolean;
};

export type Assignment = {
  course: Course;
  entries: Array<AssignmentEntry>;
  isRead: boolean;
};
