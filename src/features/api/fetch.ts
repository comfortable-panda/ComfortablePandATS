import { Assignment } from "../assignment/types";
import { Quiz } from "../quiz/types";
import { toAssignments } from "../assignment/convert";
import { toQuizzes } from "../quiz/convert";

/* Sakai APIから課題を取得する */
export const fetchAssignment = (baseURL: string, courseID: string): Promise<Assignment> => {
  const queryURL = baseURL + "/direct/assignment/site/" + courseID + ".json";
  return new Promise((resolve, reject) => {
    fetch(queryURL, { cache: "no-cache" })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          const assignmentEntries = toAssignments(data);
          const assignment: Assignment = {
            courseSite: null,
            entries: assignmentEntries,
            isRead: false,
          };
          resolve(assignment);
        } else {
          reject(`Request failed: ${response.status}`);
        }
      })
      .catch((err) => console.error(err)); // Error: Request failed: 404
  });
};

/* Sakai APIからクイズを取得する */
export const fetchQuiz = (baseURL: string, courseID: string): Promise<Quiz> => {
  const queryURL = baseURL + "/direct/sam_pub/context/" + courseID + ".json";
  return new Promise((resolve, reject) => {
    fetch(queryURL, { cache: "no-cache" })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          const quizEntries = toQuizzes(data);
          const quiz: Quiz = {
            courseSite: null,
            entries: quizEntries,
            isRead: false,
          };
          resolve(quiz);
        } else {
          reject(`Request failed: ${response.status}`);
        }
      })
      .catch((err) => console.error(err)); // Error: Request failed: 404
  });
};
