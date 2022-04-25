import { Quiz } from "./types";
import { Course } from "../course/types";
import { fetchQuiz } from "../api/fetch";

export const getSakaiQuizzes = async (courses: Array<Course>) => {
  const quizzes: Array<Quiz> = [];
  const pending: Array<Promise<Quiz>> = [];
  for (const course of courses) {
    pending.push(fetchQuiz(course));
  }
  const result = await (Promise as any).allSettled(pending);
  for (const quiz of result) {
    if (quiz.status === "fulfilled") quizzes.push(quiz.value);
  }
  return quizzes;
};

// export const getStoredQuizzes = () => {
//
// }
