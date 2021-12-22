import { loadFromLocalStorage, saveToLocalStorage } from "./storage";
import { Assignment, CourseSiteInfo } from "./model";
import { getCourseIDList, getBaseURL, getAssignmentByCourseID, getQuizFromCourseID } from "./network";
import { createMiniSakaiBtn, createNavBarNotification, displayMiniSakai } from "./minisakai";
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
import { Settings, loadSettings } from "./settings";

export const baseURL = getBaseURL();
export const VERSION = chrome.runtime.getManifest().version;
export let assignmentCacheInterval: number;
export let quizCacheInterval: number;
export let assignmentFetchedTime: number | undefined;
export let quizFetchedTime: number | undefined;
export let courseIDList: Array<CourseSiteInfo>;
export let mergedAssignmentList: Array<Assignment>;
export let mergedAssignmentListNoMemo: Array<Assignment>;
export let CPsettings: Settings;

export async function loadAndMergeAssignmentList(courseSiteInfos: Array<CourseSiteInfo>, useAssignmentCache: boolean, useQuizCache: boolean): Promise<Array<Assignment>> {
  // ストレージから前回保存したassignmentListを読み込む
  const oldAssignmentList = convertArrayToAssignment(await loadFromLocalStorage("CS_AssignmentList"));
  const oldQuizList = convertArrayToAssignment(await loadFromLocalStorage("CS_QuizList"));
  let newAssignmentList = [];
  let newQuizList = [];

  if (useAssignmentCache) {
    newAssignmentList = oldAssignmentList;
  } else {
    console.log("Fetching assignments...");
    const pendingList = [];
    // 課題取得待ちリストに追加
    for (const i of courseSiteInfos) {
      pendingList.push(getAssignmentByCourseID(baseURL, i.courseID));
    }
    // 全部揃ったら取得に成功したものをnewAssignmentListに入れる
    const result = await (Promise as any).allSettled(pendingList);
    for (const k of result) {
      if (k.status === "fulfilled") newAssignmentList.push(k.value);
    }
    // 取得した時間を保存
    await saveToLocalStorage("CS_AssignmentFetchTime", nowTime);
    assignmentFetchedTime = nowTime;
  }
  // 保存してあったものとマージする
  mergedAssignmentListNoMemo = compareAndMergeAssignmentList(oldAssignmentList, newAssignmentList);
  mergedAssignmentList = compareAndMergeAssignmentList(oldAssignmentList, newAssignmentList);

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
    await saveToLocalStorage("CS_QuizFetchTime", nowTime);
    quizFetchedTime = nowTime;
  }
  const mergedQuizList = compareAndMergeAssignmentList(oldQuizList, newQuizList);

  // マージ後のkadaiListをストレージに保存する
  await saveToLocalStorage("CS_AssignmentList", mergedAssignmentListNoMemo);
  await saveToLocalStorage("CS_QuizList", mergedQuizList);

  mergedAssignmentList = mergeIntoAssignmentList(mergedAssignmentList, mergedQuizList);

  // メモ一覧を読み込む
  const memoList = convertArrayToAssignment(await loadFromLocalStorage("CS_MemoList"));
  // さらにメモもマージする
  mergedAssignmentList = mergeIntoAssignmentList(mergedAssignmentList, memoList);
  mergedAssignmentList = sortAssignmentList(mergedAssignmentList);

  return mergedAssignmentList;
}

async function loadConfigs() {
  CPsettings = await loadSettings();
  assignmentCacheInterval = CPsettings.getAssignmentCacheInterval;
  quizCacheInterval = CPsettings.getQuizCacheInterval;
  CPsettings.displayCheckedAssignment = CPsettings.getDisplayCheckedAssignment;
  assignmentFetchedTime = await loadFromLocalStorage("CS_AssignmentFetchTime", "undefined");
  quizFetchedTime = await loadFromLocalStorage("CS_QuizFetchTime", "undefined");
}

async function loadCourseIDList() {
  courseIDList = getCourseIDList();
  await saveToLocalStorage("CS_CourseInfo", courseIDList);
}

async function main() {
  if (isLoggedIn()) {
    createMiniSakaiBtn();
    await loadConfigs();
    await loadCourseIDList();
    mergedAssignmentList = await loadAndMergeAssignmentList(
      courseIDList,
      useCache(assignmentFetchedTime, assignmentCacheInterval),
      useCache(quizFetchedTime, quizCacheInterval)
    );
    // await addBookmarkedCourseSites(baseURL);
    await displayMiniSakai(mergedAssignmentList, courseIDList);
    createNavBarNotification(courseIDList, mergedAssignmentList);

    miniSakaiReady();
    updateIsReadFlag(mergedAssignmentListNoMemo);
  }
}

main();
