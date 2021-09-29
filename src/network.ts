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

function getKadaiFromCourseID(baseURL: string, courseID: string): Promise<Assignment> {
  const queryURL = baseURL + "/direct/assignment/site/" + courseID + ".json";
  const request = new XMLHttpRequest();
  request.open("GET", queryURL);
  // キャッシュ対策
  request.setRequestHeader("Pragma", "no-cache");
  request.setRequestHeader("Cache-Control", "no-cache");
  request.setRequestHeader("If-Modified-Since","Thu, 01 Jun 1970 00:00:00 GMT");
  request.responseType = "json";
  return new Promise((resolve, reject) => {
    request.addEventListener("load", (e) => {
      const res = request.response;
      if (!res || !res.assignment_collection)
        reject("404 kadai data not found");
      else {
        const courseSiteInfo = new CourseSiteInfo(courseID, courseID); // TODO: lectureName
        const kadaiEntries = convJsonToKadaiEntries(res, baseURL, courseID);
        resolve(new Assignment(courseSiteInfo, kadaiEntries, false));
      }
    });
    request.send();
  });
}

function getQuizFromCourseID(baseURL: string, courseID: string): Promise<Assignment> {
  const queryURL = baseURL + "/direct/sam_pub/context/" + courseID + ".json";
  const request = new XMLHttpRequest();
  request.open("GET", queryURL);
  // キャッシュ対策
  request.setRequestHeader("Pragma", "no-cache");
  request.setRequestHeader("Cache-Control", "no-cache");
  request.setRequestHeader("If-Modified-Since","Thu, 01 Jun 1970 00:00:00 GMT");
  request.responseType = "json";

  return new Promise((resolve, reject) => {
    request.addEventListener("load", (e) => {
      const res = request.response;
      if (!res || !res.sam_pub_collection) reject("404 kadai data not found");
      else {
        const courseSiteInfo = new CourseSiteInfo(courseID, courseID); // TODO: lectureName
        const kadaiEntries = convJsonToQuizEntries(res, baseURL, courseID);
        resolve(new Assignment(courseSiteInfo, kadaiEntries, false));
      }
    });
    request.send();
  });
}

function convJsonToKadaiEntries(data: Record<string, any>, baseURL: string, siteID: string): Array<AssignmentEntry> {
  const assignment_collection = data.assignment_collection;
  return assignment_collection
    .filter((json: any) => json.dueTime.epochSecond * 1000 >= nowTime)
    .map((json: any) => {
      const kadaiID = json.id;
      const kadaiTitle = json.title;
      const kadaiDetail = json.instructions;
      const kadaiDueEpoch = json.dueTime.epochSecond;
      const entry = new AssignmentEntry(kadaiID, kadaiTitle, kadaiDueEpoch, false, false, false, kadaiDetail);
      entry.assignmentPage = baseURL + "/portal/site/" + siteID;
      return entry;
    });
}

function convJsonToQuizEntries(data: Record<string, any>, baseURL: string, siteID: string): Array<AssignmentEntry> {
  return data.sam_pub_collection
    .filter((json: any) => json.dueDate >= nowTime)
    .filter((json: any) => json.startDate < nowTime)
    .map((json: any) => {
      const quizID = "q" + json.publishedAssessmentId;
      const quizTitle = json.title;
      const quizDetail = "";
      const quizDueEpoch = json.dueDate / 1000;
      const entry = new AssignmentEntry(quizID, quizTitle, quizDueEpoch, false, false, true, quizDetail);
      entry.assignmentPage = baseURL + "/portal/site/" + siteID;
      return entry;
    });
}

export { getBaseURL, getCourseIDList, getKadaiFromCourseID, getQuizFromCourseID };
