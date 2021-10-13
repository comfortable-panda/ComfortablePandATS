import { Assignment, AssignmentEntry, CourseSiteInfo } from "./model";
import { nowTime } from "./utils";
import { CPsettings } from "./content_script";


function getBaseURL(): string {
  let baseURL = "";
  const match = location.href.match("(https?://[^/]+)/portal");
  if (match) {
    baseURL = match[1];
  }
  return baseURL;
}

// Lecture ID をすべて取得する
// ネットワーク通信は行わない
function getCourseIDList(): Array<CourseSiteInfo> {
  const elementCollection = document.getElementsByClassName("fav-sites-entry");
  const elements = Array.prototype.slice.call(elementCollection);
  const result = [];
  for (const elem of elements) {
    const lectureInfo = new CourseSiteInfo("", ""); // tabTypeはPandAのトップバーに存在するかしないか
    const lecture = elem
      .getElementsByTagName("div")[0]
      .getElementsByTagName("a")[0];
    const m = lecture.href.match("(https?://[^/]+)/portal/site-?[a-z]*/([^/]+)");
    if (m && m[2][0] !== "~") {
      lectureInfo.courseID = m[2];
      lectureInfo.courseName = lecture.title;
      result.push(lectureInfo);
    }
  }
  return result;
}

function getAssignmentByCourseID(baseURL: string, courseID: string): Promise<Assignment> {
  const queryURL = baseURL + "/direct/assignment/site/" + courseID + ".json";

  return new Promise((resolve, reject) => {
    fetch(queryURL, { cache: "no-cache" })
      .then(async (response) => {
        if (response.ok) {
          const res = await response.json();
          console.log("kadai ", res)
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

function getQuizFromCourseID(baseURL: string, courseID: string): Promise<Assignment> {
  const queryURL = baseURL + "/direct/sam_pub/context/" + courseID + ".json";

  return new Promise((resolve, reject) => {
    fetch(queryURL, { cache: "no-cache" })
      .then(async (response) => {
        if (response.ok) {
          const res = await response.json();
          console.log("quiz ", res)
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

function convJsonToAssignmentEntries(data: Record<string, any>, baseURL: string, siteID: string): Array<AssignmentEntry> {
  const assignment_collection = data.assignment_collection;
  return assignment_collection
    .filter((json: any) => json.dueTime.epochSecond * 1000 >= nowTime)
    .map((json: any) => {
      const assignmentID = json.id;
      const assignmentTitle = json.title;
      const assignmentDetail = json.instructions;
      const dueDateTimestamp = json.dueTime.epochSecond;
      const entry = new AssignmentEntry(assignmentID, assignmentTitle, dueDateTimestamp, false, false, false, assignmentDetail);
      entry.assignmentPage = baseURL + "/portal/site/" + siteID;
      return entry;
    });
}

function convJsonToQuizEntries(data: Record<string, any>, baseURL: string, siteID: string): Array<AssignmentEntry> {
  return data.sam_pub_collection
    .filter((json: any) => json.startDate < nowTime)
    .map((json: any) => {
      const quizID = "q" + json.publishedAssessmentId;
      const quizTitle = json.title;
      const quizDetail = "";
      const quizDueEpoch = json.dueDate ? json.dueDate / 1000 : null;
      const entry = new AssignmentEntry(quizID, quizTitle, quizDueEpoch, false, false, true, quizDetail);
      entry.assignmentPage = baseURL + "/portal/site/" + siteID;
      return entry;
    });
}

export { getBaseURL, getCourseIDList, getAssignmentByCourseID, getQuizFromCourseID };
