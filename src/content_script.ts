import { loadFromLocalStorage, saveToLocalStorage } from "./storage";
import { Assignment, CourseSiteInfo } from "./model";
import {
  getCourseIDList,
  getBaseURL,
  getAssignmentByCourseID,
  getQuizFromCourseID,
} from "./network";
import {
  createMiniSakaiBtn,
  createNavBarNotification,
  displayMiniPandA,
} from "./minipanda";
import { addBookmarkedCourseSites } from "./bookmark";
import {
  compareAndMergeAssignmentList,
  convertArrayToAssignment,
  isLoggedIn,
  mergeIntoAssignmentList,
  miniSakaiReady,
  nowTime,
  sortAssignmentList,
  updateIsReadFlag,
  useCache,
} from "./utils";
import { DefaultSettings, Settings } from "./settings";

export const baseURL = getBaseURL();
export const VERSION = "1.0.0";
export let kadaiCacheInterval: number;
export let quizCacheInterval: number;
export let kadaiFetchedTime: number;
export let quizFetchedTime: number;
export let courseIDList: Array<CourseSiteInfo>;
export let mergedKadaiList: Array<Assignment>;
export let mergedKadaiListNoMemo: Array<Assignment>;
export let CPsettings: Settings;

export async function loadAndMergeKadaiList(courseSiteInfos: Array<CourseSiteInfo>, useKadaiCache: boolean, useQuizCache: boolean): Promise<Array<Assignment>> {
  // ストレージから前回保存したkadaiListを読み込む
  const oldKadaiList = convertArrayToAssignment(await loadFromLocalStorage("TSkadaiList"));
  const oldQuizList = convertArrayToAssignment(await loadFromLocalStorage("TSQuizList"));
  let newKadaiList = [];
  let newQuizList = [];

  if (useKadaiCache) {
    newKadaiList = oldKadaiList;
  } else {
    console.log("Fetching assignments...");
    const pendingList = [];
    // 課題取得待ちリストに追加
    for (const i of courseSiteInfos) {
      pendingList.push(getAssignmentByCourseID(baseURL, i.courseID));
    }
    // 全部揃ったら取得に成功したものをnewKadaiListに入れる
    const result = await (Promise as any).allSettled(pendingList);
    for (const k of result) {
      if (k.status === "fulfilled") newKadaiList.push(k.value);
    }
    // 取得した時間を保存
    await saveToLocalStorage("TSkadaiFetchedTime", nowTime);
    kadaiFetchedTime = nowTime;
  }
  // 保存してあったものとマージする
  mergedKadaiListNoMemo = compareAndMergeAssignmentList(oldKadaiList, newKadaiList);
  mergedKadaiList = compareAndMergeAssignmentList(oldKadaiList, newKadaiList);

  if (useQuizCache) {
    if (typeof oldQuizList !== "undefined") {
      newQuizList = oldQuizList;
    }
  } else {
    console.log("Fetching quizzes...");
    const pendingList = [];
    // クイズ取得待ちリストに追加
    for (const i of courseSiteInfos) {
      pendingList.push(getQuizFromCourseID(baseURL, i.courseID));
    }
    // 全部揃ったら取得に成功したものをnewQuizListに入れる
    const result = await (Promise as any).allSettled(pendingList);
    for (const k of result) {
      if (k.status === "fulfilled") newQuizList.push(k.value);
    }
    // 取得した時間を保存
    await saveToLocalStorage("TSquizFetchedTime", nowTime);
    quizFetchedTime = nowTime;
  }
  const mergedQuizList = compareAndMergeAssignmentList(oldQuizList, newQuizList);

  // マージ後のkadaiListをストレージに保存する
  await saveToLocalStorage("TSkadaiList", mergedKadaiListNoMemo);
  await saveToLocalStorage("TSQuizList", mergedQuizList);

  mergedKadaiList = mergeIntoAssignmentList(mergedKadaiList, mergedQuizList);

  // メモ一覧を読み込む
  const kadaiMemoList = convertArrayToAssignment(await loadFromLocalStorage("TSkadaiMemoList"));
  // さらにメモもマージする
  mergedKadaiList = mergeIntoAssignmentList(mergedKadaiList, kadaiMemoList);
  mergedKadaiList = sortAssignmentList(mergedKadaiList);

  return mergedKadaiList;
}

async function loadSettings() {
  CPsettings = await loadFromLocalStorage("TSSettings");
  kadaiCacheInterval = CPsettings.kadaiCacheInterval ?? DefaultSettings.kadaiCacheInterval;
  quizCacheInterval = CPsettings.quizCacheInterval ?? DefaultSettings.quizCacheInterval;
  CPsettings.displayCheckedKadai = CPsettings.displayCheckedKadai ?? true;
  kadaiFetchedTime = await loadFromLocalStorage("TSkadaiFetchedTime");
  quizFetchedTime = await loadFromLocalStorage("TSquizFetchedTime");
}

async function loadCourseIDList() {
  courseIDList = getCourseIDList();
  await saveToLocalStorage("TSlectureids", courseIDList);
}

async function main() {
  if (isLoggedIn()) {
    createMiniSakaiBtn();
    await loadSettings();
    await loadCourseIDList();
    mergedKadaiList = await loadAndMergeKadaiList(courseIDList, useCache(kadaiFetchedTime, kadaiCacheInterval), useCache(quizFetchedTime, quizCacheInterval));
    await addBookmarkedCourseSites(baseURL);
    await displayMiniPandA(mergedKadaiList, courseIDList);
    createNavBarNotification(courseIDList, mergedKadaiList);

    miniSakaiReady();
    updateIsReadFlag(mergedKadaiListNoMemo);
  }
}

main();
