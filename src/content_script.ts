import { loadFromStorage, saveToStorage } from "./storage";
import { Kadai, LectureInfo } from "./kadai";
import { fetchLectureIDs, getKadaiOfLectureID } from "./network";
import {
  appendMemoBox,
  createHanburgerButton,
  createMiniPandA,
  createNavBarNotification,
  updateMiniPandA
} from "./minipanda";
import { addMissingBookmarkedLectures } from "./bookmark";
import {
  compareAndMergeKadaiList,
  convertArrayToKadai,
  isLoggedIn, mergeMemoIntoKadaiList,
  miniPandAReady,
  nowTime,
  updateIsReadFlag,
  useCache,
} from "./utils";
import {deleteKadaiMemo} from "./eventListener";

const baseURL = "http://35.227.163.2/";
export let fetchedTime: number;
export let lectureIDList: Array<LectureInfo>;
export let mergedKadaiList: Array<Kadai>;
export let mergedKadaiListNoMemo: Array<Kadai>;

async function loadAndMergeKadaiList(lectureIDList: Array<LectureInfo>, useCache: boolean): Promise<Array<Kadai>> {
  const oldKadaiList = await loadFromStorage("kadaiList");
  console.log("kadaiListOLD", convertArrayToKadai(oldKadaiList));
  const newKadaiList = [];
  let tmpKadaiList = [];

  if (useCache) {
    console.log("キャッシュなし");
    const pendingList = [];
    for (const i of lectureIDList) {
      pendingList.push(getKadaiOfLectureID(baseURL, i.lectureID));
    }

    const result = await (Promise as any).allSettled(pendingList);
    for (const k of result) {
      if (k.status === "fulfilled") newKadaiList.push(k.value);
    }
    await saveToStorage("fetchedTime", nowTime);
    console.log("kadaiListNEW", newKadaiList);
    tmpKadaiList = compareAndMergeKadaiList(oldKadaiList, newKadaiList);
  } else {
    console.log("キャッシュあり");
    tmpKadaiList = compareAndMergeKadaiList(oldKadaiList, oldKadaiList);
  }
  mergedKadaiListNoMemo = JSON.parse(JSON.stringify(tmpKadaiList));
  mergedKadaiList = JSON.parse(JSON.stringify(tmpKadaiList));
  await saveToStorage("kadaiList", mergedKadaiListNoMemo);// TODO
  console.log("kadaiListMERGED", mergedKadaiListNoMemo);


  const kadaiMemoList = convertArrayToKadai(await loadFromStorage("kadaiMemoList"));
  console.log("kadaiMemoList", kadaiMemoList);
  mergedKadaiList = mergeMemoIntoKadaiList(mergedKadaiList, kadaiMemoList);

  return mergedKadaiList;
}

export async function displayMiniPandA(mergedKadaiList: Array<Kadai>, lectureIDList: Array<LectureInfo>, fetchedTime: number){
  createMiniPandA(useCache(fetchedTime) ? nowTime : fetchedTime);
  appendMemoBox(lectureIDList);
  updateMiniPandA(mergedKadaiList, lectureIDList);
}

async function main() {
  if (isLoggedIn()) {
    createHanburgerButton();
    fetchedTime = await loadFromStorage("fetchedTime");
    lectureIDList = fetchLectureIDs()[1];
    mergedKadaiList = await loadAndMergeKadaiList(lectureIDList, useCache(fetchedTime));


    await displayMiniPandA(mergedKadaiList, lectureIDList, fetchedTime);

    miniPandAReady();
    updateIsReadFlag(mergedKadaiListNoMemo);
    createNavBarNotification(lectureIDList, mergedKadaiList);
  }
}

main();
addMissingBookmarkedLectures();
