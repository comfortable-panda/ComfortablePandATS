import { QuizEntry } from "./types";
import { nowTime } from "../../utils";
import { AssignmentEntry } from "../../model";

/* Sakai APIから取得した課題をQuizEntryに変換する */
export const toQuizzes = (data: Record<string, any>): Array<QuizEntry> => {
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
