import { Course } from "../course/types";

export type MemoEntry = {
  id: string;
  title: string;
  dueTime: number | null;
  hasFinished: boolean;
};

export type Memo = {
  course: Course;
  entries: Array<MemoEntry>;
  isRead: boolean;
};
