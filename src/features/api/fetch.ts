import { Assignment } from "../assignment/types";
import { Quiz } from "../quiz/types";
import { Course } from "../course/types";
import { toAssignments } from "../assignment/convert";
import { toQuizzes } from "../quiz/convert";

/* Sakai APIから課題を取得する */
export const fetchAssignment = (baseURL: string, courseID: string): Promise<(course: Course) => Assignment> => {
  const queryURL = baseURL + "/direct/assignment/site/" + courseID + ".json";
  return new Promise((resolve, reject) => {
    fetch(queryURL, { cache: "no-cache" })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          const assignmentEntries = toAssignments(data);
          resolve((course: Course) => {
            return {
              course: course,
              entries: assignmentEntries,
              isRead: false,
            };
          });
        } else {
          reject(`Request failed: ${response.status}`);
        }
      })
      .catch((err) => console.error(err)); // Error: Request failed: 404
  });
};

/* Sakai APIからクイズを取得する */
export const fetchQuiz = (baseURL: string, courseID: string): Promise<(course: Course) => Quiz> => {
  const queryURL = baseURL + "/direct/sam_pub/context/" + courseID + ".json";
  return new Promise((resolve, reject) => {
    fetch(queryURL, { cache: "no-cache" })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          const quizEntries = toQuizzes(data);
          resolve((course: Course) => {
            return {
              course: course,
              entries: quizEntries,
              isRead: false,
            };
          });
        } else {
          reject(`Request failed: ${response.status}`);
        }
      })
      .catch((err) => console.error(err)); // Error: Request failed: 404
  });
};
