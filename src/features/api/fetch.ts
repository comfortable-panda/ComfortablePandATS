import { Assignment } from "../entity/assignment/types";
import { Quiz } from "../entity/quiz/types";
import { Course } from "../course/types";
import { decodeAssignmentFromAPI } from "../entity/assignment/decode";
import { decodeQuizFromAPI } from "../entity/quiz/decode";

/* Sakai のURLを取得する */
export const getBaseURL = (): string => {
    let baseURL = "";
    const match = location.href.match("(https?://[^/]+)/portal");
    if (match) {
        baseURL = match[1];
    }
    return baseURL;
};

/* Sakai のお気に入り欄からCourseを取得する */
export const fetchCourse = (): Array<Course> => {
    const baseURL = getBaseURL();
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
                link: baseURL + "/portal/site/" + m[2]
            };
            courses.push(course);
        }
    }
    return courses;
};

/* Sakai APIから課題を取得する */
export const fetchAssignment = (course: Course): Promise<Assignment> => {
    const queryURL = getBaseURL() + "/direct/assignment/site/" + course.id + ".json";
    return new Promise((resolve, reject) => {
        fetch(queryURL, { cache: "no-cache" })
            .then(async (response) => {
                if (response.ok) {
                    const data = await response.json();
                    const assignmentEntries = decodeAssignmentFromAPI(data);
                    resolve(new Assignment(course, assignmentEntries, false));
                } else {
                    reject(`Request failed: ${response.status}`);
                }
            })
            .catch((err) => console.error(err)); // Error: Request failed: 404
    });
};

/* Sakai APIからクイズを取得する */
export const fetchQuiz = (course: Course): Promise<Quiz> => {
    const queryURL = getBaseURL() + "/direct/sam_pub/context/" + course.id + ".json";
    return new Promise((resolve, reject) => {
        fetch(queryURL, { cache: "no-cache" })
            .then(async (response) => {
                if (response.ok) {
                    const data = await response.json();
                    const quizEntries = decodeQuizFromAPI(data);
                    resolve(new Quiz(course, quizEntries, true));
                } else {
                    reject(`Request failed: ${response.status}`);
                }
            })
            .catch((err) => console.error(err)); // Error: Request failed: 404
    });
};
