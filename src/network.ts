import { Kadai, KadaiEntry, LectureInfo } from "./kadai";
import { nowTime } from "./utils";

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
    const m = lecture.href.match("(https?://[^/]+)/portal/site-reset/([^/]+)");
    if (m) {
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
      if (res == null) reject("404 kadai data not found");
      const kadaiEntries = convJsonToKadaiEntries(res, baseURL, lectureID);
      resolve(
        new Kadai(
          lectureID,
          lectureID, // TODO: lectureName
          kadaiEntries,
          false
        )
      );
    });
    request.send();
  });
}

function convJsonToKadaiEntries(data: Record<string, any>, baseURL: string, siteID: string): Array<KadaiEntry> {
  return data.assignment_collection
    .filter((json: any) => json.dueTime.epochSecond * 1000 >= nowTime)
    .map((json: any) => {
      const kadaiID = json.id;
      const kadaiTitle = json.title;
      const kadaiDetail = json.instructions;
      const kadaiDueEpoch = json.dueTime.epochSecond;
      const entry = new KadaiEntry(kadaiID, kadaiTitle, kadaiDueEpoch, false, false, kadaiDetail);
      entry.kadaiPage = baseURL + "/portal/site/" + siteID;
      return entry;
    });
}

export { fetchLectureIDs, getKadaiOfLectureID };
