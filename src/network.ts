import { Kadai, KadaiEntry } from "./kadai";

function fetchLectureIDs(): [string, Array<string>] {
  const elementCollection = document.getElementsByClassName("link-container");
  const elements = Array.prototype.slice.call(elementCollection);
  const result = [];
  let domain = null;
  for (const elem of elements) {
    const m = elem.href.match("(https?:\/\/[^/]+)\/portal\/site\/([^/]+)");
    if (m) {
      result.push(m[2]);
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
  request.responseType = "json";
  return new Promise((resolve, reject) => {
    request.addEventListener("load", (e) => {
      const res = request.response;
      const kadaiEntries = convJsonToKadaiEntries(res);
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

function convJsonToKadaiEntries(data: Record<string, any>): Array<KadaiEntry> {
  return data.assignment_collection.map((json: any) => {
    const kadaiID = json.id;
    const kadaiTitle = json.title;
    const kadaiDetail = json.instructions;
    const kadaiDueEpoch = json.dueTime.epochSecond;
    new KadaiEntry(kadaiID, kadaiTitle, kadaiDueEpoch, false, kadaiDetail);
  });
}
