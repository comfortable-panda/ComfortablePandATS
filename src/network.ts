import { Kadai, KadaiEntry, LectureInfo } from "./kadai";
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
// returns [domain, {tabType, lectureID, lectureName}]
function fetchLectureIDs(): [string, Array<LectureInfo>] {
  const elementCollection = document.getElementsByClassName("fav-sites-entry");
  const elements = Array.prototype.slice.call(elementCollection);
  const result = [];
  let domain = null;
  for (const elem of elements) {
    const lectureInfo = { tabType: "default", lectureID: "", lectureName: "" }; // tabTypeはPandAのトップバーに存在するかしないか
    const lecture = elem
      .getElementsByTagName("div")[0]
      .getElementsByTagName("a")[0];
    const m = lecture.href.match("(https?://[^/]+)/portal/site-?[a-z]*/([^/]+)");
    if (m && m[2][0] !== "~") {
      lectureInfo.lectureID = m[2];
      lectureInfo.lectureName = lecture.title;
      result.push(lectureInfo);
      if (!domain) {
        domain = m[1];
      }
    }
  }
  return [domain, result];
}

function getKadaiOfLectureID(baseURL: string, lectureID: string): Promise<Kadai> {
  const queryURL = baseURL + "/direct/assignment/site/" + lectureID + ".json";
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
        const kadaiEntries = convJsonToKadaiEntries(res, baseURL, lectureID);
        resolve(
          new Kadai(
            lectureID,
            lectureID, // TODO: lectureName
            kadaiEntries,
            false
          )
        );
      }
    });
    request.send();
  });
}

function getQuizOfLectureID(baseURL: string, siteID: string) {
  const queryURL = baseURL + "/direct/sam_pub/context/" + siteID + ".json";
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
        const kadaiEntries = convJsonToQuizEntries(res, baseURL, siteID);
        resolve(
          new Kadai(
            siteID,
            siteID, // TODO: lectureName
            kadaiEntries,
            false
          )
        );
      }
    });
    request.send();
  });
}

function convJsonToKadaiEntries(data: Record<string, any>, baseURL: string, siteID: string): Array<KadaiEntry> {
  const assignment_collection = data.assignment_collection;
  return assignment_collection
    .filter((json: any) => json.dueTime.epochSecond * 1000 >= nowTime)
    .map((json: any) => {
      const kadaiID = json.id;
      const kadaiTitle = json.title;
      const kadaiDetail = json.instructions;
      const kadaiDueEpoch = json.dueTime.epochSecond;
      const entry = new KadaiEntry(kadaiID, kadaiTitle, kadaiDueEpoch, false, false, false, kadaiDetail);
      entry.kadaiPage = baseURL + "/portal/site/" + siteID;
      return entry;
    });
}

function convJsonToQuizEntries(data: Record<string, any>, baseURL: string, siteID: string): Array<KadaiEntry> {
  return data.sam_pub_collection
    .filter((json: any) => json.dueDate >= nowTime)
    .filter((json: any) => json.startDate < nowTime)
    .map((json: any) => {
      const quizID = "q" + json.publishedAssessmentId;
      const quizTitle = json.title;
      const quizDetail = "";
      const quizDueEpoch = json.dueDate / 1000;
      const entry = new KadaiEntry(quizID, quizTitle, quizDueEpoch, false, false, true, quizDetail);
      entry.kadaiPage = baseURL + "/portal/site/" + siteID;
      return entry;
    });
}

export { getBaseURL, fetchLectureIDs, getKadaiOfLectureID, getQuizOfLectureID };
