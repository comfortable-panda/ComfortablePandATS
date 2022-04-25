import { Quiz } from "./types";
import { toStorage } from "../storage/save";

export const saveQuizzes = (hostname: string, assignments: Array<Quiz>): Promise<string> => {
  return toStorage(hostname, "CS_QuizList", assignments);
};
