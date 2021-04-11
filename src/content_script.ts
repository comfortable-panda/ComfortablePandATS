import { loadFromStorage, saveToStorage } from "./storage";
import { Kadai, KadaiEntry, LectureInfo } from "./kadai";
import { fetchLectureIDs, getKadaiOfLectureID } from "./network";
import {
  createHanburgerButton,
  createMiniPandA, createNavBarNotification,
  updateMiniPandA
} from "./minipanda";
import { addMissingBookmarkedLectures } from "./bookmark";
import {
  compareAndMergeKadaiList,
  convertArrayToKadai,
  isLoggedIn,
  miniPandAReady,
  updateIsReadFlag
} from "./utils";

const baseURL = "http://35.227.163.2/";


async function loadAndMergeKadaiList(lectureIDList: Array<LectureInfo>): Promise<Array<Kadai>> {
  const pendingList = [];
  for (const i of lectureIDList) {
    pendingList.push(getKadaiOfLectureID(baseURL, i.lectureID));
  }

  const result = await (Promise as any).allSettled(pendingList);
  const kadaiList = [];
  for (const k of result) {
    if (k.status === "fulfilled") {
      kadaiList.push(k.value);
    }
  }

  console.log("kadaiListNEW", kadaiList);
  const old = await loadFromStorage("kadaiList");
  console.log("kadaiListOLD", convertArrayToKadai(old));
  const mergedKadaiList = compareAndMergeKadaiList(old, kadaiList);
  console.log("kadaiListMERGED", mergedKadaiList);
  return mergedKadaiList;
}

async function main() {
  if (isLoggedIn()) {
    createHanburgerButton();
    createMiniPandA(100101010);
    const lectureIDList = fetchLectureIDs()[1];
    console.log("lecture ID", lectureIDList);
    const mergedKadaiList = await loadAndMergeKadaiList(lectureIDList);
    saveToStorage("kadaiList", mergedKadaiList);
    updateIsReadFlag(mergedKadaiList);
    updateMiniPandA(mergedKadaiList, lectureIDList);
    miniPandAReady();
    createNavBarNotification(lectureIDList, mergedKadaiList);
  }
}

main();
addMissingBookmarkedLectures();
