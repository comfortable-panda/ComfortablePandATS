import { loadFromLocalStorage, saveToLocalStorage } from "./storage";
import { Assignment, CourseSiteInfo } from "./model";
import { getCourseIDList, getAssignmentByCourseID, getQuizFromCourseID } from "./network";
import { createMiniSakaiBtn, createFavoritesBarNotification, displayMiniSakai } from "./minisakai";

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
import { Config, loadConfigs } from "./settings";

export let courseIDList: Array<CourseSiteInfo>;
export let mergedAssignmentList: Array<Assignment>;
export let mergedAssignmentListNoMemo: Array<Assignment>;

/**
 * Load old assignments/quizzes from storage and fetch new assignments/quizzes from Sakai.
 * @param {Config} config
 * @param {CourseSiteInfo[]} courseSiteInfos
 * @param {boolean} useAssignmentCache
 * @param {boolean} useQuizCache
 */
export async function loadAndMergeAssignmentList(config: Config ,courseSiteInfos: Array<CourseSiteInfo>, useAssignmentCache: boolean, useQuizCache: boolean): Promise<Array<Assignment>> {
  // Load old assignments and quizzes from local storage
  const oldAssignmentList = convertArrayToAssignment(await loadFromLocalStorage("CS_AssignmentList"));
  const oldQuizList = convertArrayToAssignment(await loadFromLocalStorage("CS_QuizList"));
  let newAssignmentList = [];
  let newQuizList = [];

  // Use cache
  if (useAssignmentCache) {
    newAssignmentList = oldAssignmentList;
  } else {
    console.log("Fetching assignments...");
    const pendingList = [];
    // Add course sites to fetch-pending list
    for (const i of courseSiteInfos) {
      pendingList.push(getAssignmentByCourseID(config.baseURL, i.courseID));
    }
    // Wait until all assignments are fetched
    const result = await (Promise as any).allSettled(pendingList);
    for (const k of result) {
      if (k.status === "fulfilled") newAssignmentList.push(k.value);
    }
    // Update assignment fetch timestamp
    await saveToLocalStorage("CS_AssignmentFetchTime", nowTime);
    config.fetchedTime.assignment = nowTime;
  }
  // Compare assignments with old ones
  mergedAssignmentListNoMemo = compareAndMergeAssignmentList(oldAssignmentList, newAssignmentList);
  mergedAssignmentList = compareAndMergeAssignmentList(oldAssignmentList, newAssignmentList);

  // Use cache
  if (useQuizCache) {
    if (typeof oldQuizList !== "undefined") {
      newQuizList = oldQuizList;
    }
  } else {
    console.log("Fetching quizzes...");
    const pendingList = [];
    // Add course sites to fetch-pending list
    for (const i of courseSiteInfos) {
      pendingList.push(getQuizFromCourseID(config.baseURL, i.courseID));
    }
    // Wait until all quizzes are fetched
    const result = await (Promise as any).allSettled(pendingList);
    for (const k of result) {
      if (k.status === "fulfilled") newQuizList.push(k.value);
    }
    // Update assignment fetch timestamp
    await saveToLocalStorage("CS_QuizFetchTime", nowTime);
    config.fetchedTime.quiz = nowTime;
  }
  // Compare quizzes with old ones
  const mergedQuizList = compareAndMergeAssignmentList(oldQuizList, newQuizList);

  // Merge assignments and quizzes
  mergedAssignmentList = mergeIntoAssignmentList(mergedAssignmentList, mergedQuizList);

  // Load memos
  const memoList = convertArrayToAssignment(await loadFromLocalStorage("CS_MemoList"));
  // Merge memos
  mergedAssignmentList = sortAssignmentList(mergeIntoAssignmentList(mergedAssignmentList, memoList));

  // Save assignments and quizzes to local storage
  await saveToLocalStorage("CS_AssignmentList", mergedAssignmentListNoMemo);
  await saveToLocalStorage("CS_QuizList", mergedQuizList);

  return mergedAssignmentList;
}

/**
 * Load course site IDs
 */
async function loadCourseIDList() {
  courseIDList = getCourseIDList();
  await saveToLocalStorage("CS_CourseInfo", courseIDList);
}

async function main() {
  if (isLoggedIn()) {
    createMiniSakaiBtn();
    const config = await loadConfigs();
    await loadCourseIDList();
    mergedAssignmentList = await loadAndMergeAssignmentList(
      config,
      courseIDList,
      useCache(config.fetchedTime.assignment, config.cacheInterval.assignment),
      useCache(config.fetchedTime.quiz, config.cacheInterval.quiz)
    );
    // await addBookmarkedCourseSites(baseURL);
    await displayMiniSakai(mergedAssignmentList, courseIDList);
    await createFavoritesBarNotification(courseIDList, mergedAssignmentList);

    miniSakaiReady();
    updateIsReadFlag(mergedAssignmentListNoMemo);
  }
}

main();
