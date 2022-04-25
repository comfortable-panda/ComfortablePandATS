import { Quiz, QuizEntry } from "./types";
import { nowTime } from "../../utils";
import { Course } from "../course/types";

/* Sakai APIから取得した課題をQuizEntryに変換する */
export const quizFromAPI = (data: Record<string, any>): Array<QuizEntry> => {
  return data.sam_pub_collection
    .filter((json: any) => json.startDate < nowTime && (json.dueDate >= nowTime || json.dueDate == null))
    .map((json: any) => {
      const entry = new QuizEntry(
        json.publishedAssessmentId,
        json.title,
        json.dueDate ? json.dueDate / 1000 : null,
        false,
      );
      return entry;
    });
};

export const quizFromStorage = (data: Array<any>): Array<Quiz> => {
  const quizzes: Array<Quiz> = [];
  for (const quiz of data) {
    const course: Course = new Course(quiz.course.id, quiz.course.name);
    const isRead: boolean = quiz.isRead;
    const entries: Array<QuizEntry> = [];
    for (const e of quiz.entries) {
      const entry = new QuizEntry(e.id, e.title, e.dueTime, e.hasFinished);
      if (entry.getDueDateTimestamp * 1000 > nowTime) entries.push(entry);
    }
    quizzes.push(new Quiz(course, entries, isRead));
  }
  return quizzes;
};