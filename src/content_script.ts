import { loadFromStorage, saveToStorage } from "./storage";
import { KadaiEntry, LectureInfo } from "./kadai";
import { fetchLectureIDs, getKadaiOfLectureID } from "./network";
import {
  createHanburgerButton,
  createMiniPandA,
  updateMiniPandA,
} from "./minipanda";
import { addMissingBookmarkedLectures } from "./bookmark";
import { convertArrayToKadai, createLectureIDMap, isLoggedIn, miniPandAReady } from "./utils";

const baseURL = "http://35.227.163.2/";

async function main() {
  if (isLoggedIn()) {
    createHanburgerButton();
    createMiniPandA(100101010);
    const lectureIDList = fetchLectureIDs();
    console.log("lecture ID", lectureIDList);
    loadAndDisplayKadai(lectureIDList[1]);
  }


  // const kadai = new KadaiEntry("abc012", "", 12, false, false, "sa");
  // saveToStorage("kadais", [kadai, kadai]);
  // console.log("ok panda");




}


function loadAndDisplayKadai(lectureIDList: Array<LectureInfo>){
  const pendingList = [];
  for (const i of lectureIDList) {
    pendingList.push(getKadaiOfLectureID(baseURL, i.lectureID));
  }
  (Promise as any).allSettled(pendingList).then(async (result: any) => {
    // console.log("kadai", result);
    const kadaiList = [];
    for (const k of result) {
      if (k.status === "fulfilled") {
        kadaiList.push(k.value);
      }
    }

    console.log("kadaiList", kadaiList);
    const old = await loadFromStorage("kadaiList");
    console.log("kadaiListOLD", convertArrayToKadai(old));
    saveToStorage("kadaiList", kadaiList);
    updateMiniPandA(kadaiList, lectureIDList);
    miniPandAReady();
  });
}


main();
addMissingBookmarkedLectures();
