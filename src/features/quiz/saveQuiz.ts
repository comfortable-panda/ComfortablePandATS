import { Quiz } from "./types";
import { toStorage } from "../storage/save";

export const saveQuizzes = (hostname: string, quizzes: Array<Quiz>): Promise<string> => {
  return toStorage(hostname, "CS_QuizList", quizzes);
};
