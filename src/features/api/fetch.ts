import { Assignment } from "../assignment/types";
import { Quiz } from "../quiz/types";
import { Course } from "../course/types";
import { toAssignments } from "../assignment/convert";
import { toQuizzes } from "../quiz/convert";

/* Sakai のお気に入り欄からCourseを取得する */
export const fetchCourse = (): Array<Course> => {
  const elementCollection = document.getElementsByClassName("fav-sites-entry");
  const elements = Array.prototype.slice.call(elementCollection);
  const courses: Array<Course> = [];
  for (const elem of elements) {
    const name = elem.getElementsByTagName("div")[0].getElementsByTagName("a")[0];
    const m = name.href.match("(https?://[^/]+)/portal/site-?[a-z]*/([^/]+)");
    if (m && m[2][0] !== "~") {
      const course: Course = {
        id: m[2],
        name: name.title,
      };
      courses.push(course);
    }
  }
  return courses;
};

/* Sakai APIから課題を取得する */
export const fetchAssignment = (baseURL: string, course: Course): Promise<Assignment> => {
  const queryURL = baseURL + "/direct/assignment/site/" + course.id + ".json";
  return new Promise((resolve, reject) => {
    fetch(queryURL, { cache: "no-cache" })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          const assignmentEntries = toAssignments(data);
          resolve(new Assignment(course, assignmentEntries, false));
        } else {
          reject(`Request failed: ${response.status}`);
        }
      })
      .catch((err) => console.error(err)); // Error: Request failed: 404
  });
};

/* Sakai APIからクイズを取得する */
export const fetchQuiz = (baseURL: string, course: Course): Promise<Quiz> => {
  const queryURL = baseURL + "/direct/sam_pub/context/" + course.id + ".json";
  return new Promise((resolve, reject) => {
    fetch(queryURL, { cache: "no-cache" })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          const quizEntries = toQuizzes(data);
          resolve(new Quiz(course, quizEntries, false));
        } else {
          reject(`Request failed: ${response.status}`);
        }
      })
      .catch((err) => console.error(err)); // Error: Request failed: 404
  });
};
