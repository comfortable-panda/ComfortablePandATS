import { Course } from "../course/types";

export type QuizEntry = {
  id: string;
  title: string;
  dueTime: number | null;
  hasFinished: boolean;
};

export type Quiz = {
  course: Course;
  entries: Array<QuizEntry>;
  isRead: boolean;
};
