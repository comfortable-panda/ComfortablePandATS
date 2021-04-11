import { saveToStorage } from "./storage";
import { KadaiEntry } from "./kadai";
import { fetchLectureIDs, getKadaiOfLectureID } from "./network";
import {
  createHanburgerButton,
  createMiniPandA,
  updateMiniPandA,
} from "./minipanda";
import { addMissingBookmarkedLectures } from "./bookmark";
import { createLectureIDMap } from "./utils";

const baseURL = "http://35.227.163.2/";

function main() {
  createHanburgerButton();
  createMiniPandA(100101010);
  const kadai = new KadaiEntry("abc012", "", 12, false, false, "sa");
  saveToStorage("kadais", [kadai, kadai]);
  console.log("ok panda");

  const lectureIDList = fetchLectureIDs();
  console.log("lecture ID", lectureIDList);
  const kadaiList = [];
  for (const i of lectureIDList[1]) {
    kadaiList.push(getKadaiOfLectureID(baseURL, i.lectureID));
  }
  (Promise as any).allSettled(kadaiList).then((result: any) => {
    console.log("kadai", result);
    const kadaiList2 = [];
    for (const k of result) {
      if (k.status === "fulfilled") {
        kadaiList2.push(k.value);
      }
    }
    console.log("kadaiList", kadaiList2);
    updateMiniPandA(kadaiList2, lectureIDList[1]);
  });
}

main();
addMissingBookmarkedLectures();
