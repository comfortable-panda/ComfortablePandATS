import { Assignment, AssignmentEntry, CourseSiteInfo } from "./model";
import { nowTime } from "./utils";

/**
 * Get base URL of Sakai.
 */
function getBaseURL(): string {
  let baseURL = "";
  const match = location.href.match("(https?://[^/]+)/portal");
  if (match) {
    baseURL = match[1];
  }
  return baseURL;
}

/**
 * Fetch course site IDs.
 */
function getCourseIDList(): Array<CourseSiteInfo> {
  const elementCollection = document.getElementsByClassName("fav-sites-entry");
  const elements = Array.prototype.slice.call(elementCollection);
  const result = [];
  for (const elem of elements) {
    const lectureInfo = new CourseSiteInfo("", "");
    const lecture = elem.getElementsByTagName("div")[0].getElementsByTagName("a")[0];
    const m = lecture.href.match("(https?://[^/]+)/portal/site-?[a-z]*/([^/]+)");
    if (m && m[2][0] !== "~") {
      lectureInfo.courseID = m[2];
      lectureInfo.courseName = lecture.title;
      result.push(lectureInfo);
    }
  }
  return result;
}

/**
 * Fetch assignments from Sakai REST API.
 * @param {string} baseURL
 * @param {string} courseID
 */
function getAssignmentByCourseID(baseURL: string, courseID: string): Promise<Assignment> {
  const queryURL = baseURL + "/direct/assignment/site/" + courseID + ".json";

  return new Promise((resolve, reject) => {
    fetch(queryURL, { cache: "no-cache" })
      .then(async (response) => {
        if (response.ok) {
          const res = await response.json();
          const courseSiteInfo = new CourseSiteInfo(courseID, courseID); // TODO: lectureName
          const assignmentEntries = convJsonToAssignmentEntries(res, baseURL, courseID);
          resolve(new Assignment(courseSiteInfo, assignmentEntries, false));
        } else {
          reject(`Request failed: ${response.status}`);
        }
      })
      .catch((err) => console.error(err)); // Error: Request failed: 404
  });
}

/**
 * Fetch quizzes from Sakai REST API.
 * @param {string} baseURL
 * @param {string} courseID
 */
function getQuizFromCourseID(baseURL: string, courseID: string): Promise<Assignment> {
  const queryURL = baseURL + "/direct/sam_pub/context/" + courseID + ".json";

  return new Promise((resolve, reject) => {
    fetch(queryURL, { cache: "no-cache" })
      .then(async (response) => {
        if (response.ok) {
          const res = await response.json();
          const courseSiteInfo = new CourseSiteInfo(courseID, courseID); // TODO: lectureName
          const assignmentEntries = convJsonToQuizEntries(res, baseURL, courseID);
          resolve(new Assignment(courseSiteInfo, assignmentEntries, false));
        } else {
          reject(`Request failed: ${response.status}`);
        }
      })
      .catch((err) => console.error(err)); // Error: Request failed: 404
  });
}

/**
 * Convert json response to AssignmentEntries.
 * @param data
 * @param baseURL
 * @param siteID
 */
function convJsonToAssignmentEntries(data: Record<string, any>, baseURL: string, siteID: string): Array<AssignmentEntry> {
  const assignment_collection = data.assignment_collection;
  return assignment_collection
    .filter((json: any) => json.closeTime.epochSecond * 1000 >= nowTime)
    .map((json: any) => {
      const assignmentID = json.id;
      const assignmentTitle = json.title;
      const assignmentDetail = json.instructions;
      const dueDateTimestamp = json.dueTime.epochSecond ? json.dueTime.epochSecond : null;
      const closeDateTimestamp = json.closeTime.epochSecond ? json.closeTime.epochSecond : null;
      const entry = new AssignmentEntry(assignmentID, assignmentTitle, dueDateTimestamp, closeDateTimestamp, false, false, false, assignmentDetail);
      entry.assignmentPage = baseURL + "/portal/site/" + siteID;
      return entry;
    });
}

/**
 * Convert json response to QuizEntries.
 * @param data
 * @param baseURL
 * @param siteID
 */
function convJsonToQuizEntries(data: Record<string, any>, baseURL: string, siteID: string): Array<AssignmentEntry> {
  return data.sam_pub_collection
    .filter((json: any) => json.startDate < nowTime)
    .map((json: any) => {
      const quizID = "q" + json.publishedAssessmentId;
      const quizTitle = json.title;
      const quizDetail = "";
      const quizDueEpoch = json.dueDate ? json.dueDate / 1000 : null;
      const entry = new AssignmentEntry(quizID, quizTitle, quizDueEpoch, quizDueEpoch, false, false, true, quizDetail);
      entry.assignmentPage = baseURL + "/portal/site/" + siteID;
      return entry;
    });
}

export { getBaseURL, getCourseIDList, getAssignmentByCourseID, getQuizFromCourseID };
