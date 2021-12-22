import { Assignment, AssignmentEntry, CourseSiteInfo, DueCategory } from "./model";
import { saveToLocalStorage } from "./storage";
import { Settings } from "./settings";

export const nowTime = new Date().getTime();

function getDaysUntil(dt1: number, dt2: number): DueCategory {
  // 締め切りまでの日数を計算します
  let diff = (dt2 - dt1) / 1000;
  diff /= 3600 * 24;
  let category: DueCategory;
  if (diff > 0 && diff <= 1) {
    category = "due24h";
  } else if (diff > 1 && diff <= 5) {
    category = "due5d";
  } else if (diff > 5 && diff <= 14) {
    category = "due14d";
  } else if (diff > 14) {
    category = "dueOver14d";
  } else {
    category = "duePassed";
  }
  return category;
}

function formatTimestamp(timestamp: number | undefined): string {
  // timestampをフォーマットする
  const date = new Date(timestamp ? timestamp : nowTime);
  return (
    date.toLocaleDateString() +
    " " +
    date.getHours() +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2)
  );
}

function createCourseIDMap(courseSiteInfos: Array<CourseSiteInfo>): Map<string, string> {
  // 講義IDと講義名のMapを作る
  const courseIDMap = new Map<string, string>();
  for (const courseSiteInfo of courseSiteInfos) {
    let courseName;
    if (courseSiteInfo.courseName === undefined) courseName = "";
    else courseName = courseSiteInfo.courseName;
    courseIDMap.set(courseSiteInfo.courseID, courseName);
  }
  return courseIDMap;
}

function isLoggedIn(): boolean {
  // ログインしているかどうかを返す
  const scripts = document.getElementsByTagName("script");
  let loggedIn = false;
  for (const script of Array.from(scripts)) {
    if (script.text.match('"loggedIn": true')) loggedIn = true;
  }
  return loggedIn;
}

function getSiteCourseID(): string | undefined {
  // 現在のページの講義IDを返す
  const url = location.href;
  let courseID: string | undefined;
  const reg = new RegExp("(https?://[^/]+)/portal/site/([^/]+)");
  if (url.match(reg)) {
    courseID = url.match(reg)?.[2];
  }
  return courseID;
}

function updateIsReadFlag(assignmentList: Array<Assignment>): void {
  const courseID = getSiteCourseID();
  const updatedAssignmentList = [];
  // TODO: 怪しい処理を見直す
  if (courseID && courseID.length >= 17) {
    for (const assignment of assignmentList) {
      if (assignment.courseSiteInfo.courseID === courseID) {
        updatedAssignmentList.push(new Assignment(assignment.courseSiteInfo, assignment.assignmentEntries, true));
      } else {
        updatedAssignmentList.push(assignment);
      }
    }
    saveToLocalStorage("CS_AssignmentList", updatedAssignmentList);
  }
}

function miniSakaiReady(): void {
  // ロード表示を切り替えて3本線表示にする
  const loadingIcon = document.getElementsByClassName("cs-loading")[0];
  const hamburgerIcon = document.createElement("img");
  hamburgerIcon.src = chrome.extension.getURL("img/miniSakaiBtn.png");
  hamburgerIcon.className = "cs-minisakai-btn";
  loadingIcon.className = "cs-minisakai-btn-div";
  loadingIcon.append(hamburgerIcon);
}

function convertArrayToSettings(arr: any): Settings {
  const settings = new Settings();
  settings.assignmentCacheInterval = arr.assignmentCacheInterval;
  settings.quizCacheInterval = arr.quizCacheInterval;
  settings.displayCheckedAssignment = arr.displayCheckedAssignment;
  settings.displayLateSubmitAssignment = arr.displayLateSubmitAssignment;
  settings.topColorDanger = arr.topColorDanger;
  settings.topColorWarning = arr.topColorWarning;
  settings.topColorSuccess = arr.topColorSuccess;
  settings.miniColorDanger = arr.miniColorDanger;
  settings.miniColorWarning = arr.miniColorWarning;
  settings.miniColorSuccess = arr.miniColorSuccess;
  return settings;
}

function convertArrayToAssignment(arr: Array<any>): Array<Assignment> {
  const assignmentList = [];
  for (const i of arr) {
    const assignmentEntries = [];
    for (const e of i.assignmentEntries) {
      const entry = new AssignmentEntry(e.assignmentID, e.assignmentTitle, e.dueDateTimestamp, e.closeDateTimestamp, e.isMemo, e.isFinished, e.isQuiz ,e.assignmentDetail);
      entry.assignmentPage = e.assignmentPage;
      if (entry.getCloseDateTimestamp * 1000 > nowTime) assignmentEntries.push(entry);
    }
    assignmentList.push(new Assignment(new CourseSiteInfo(i.courseSiteInfo.courseID, i.courseSiteInfo.courseName), assignmentEntries, i.isRead))
  }
  return assignmentList;
}

function compareAndMergeAssignmentList(oldAssignmentiList: Array<Assignment>, newAssignmentList: Array<Assignment>): Array<Assignment>{
  const mergedAssignmentList = [];

  // 最新の課題リストをもとにマージする
  for (const newAssignment of newAssignmentList) {
    const idx = oldAssignmentiList.findIndex((oldAssignment: Assignment) => {
      return oldAssignment.courseSiteInfo.courseID === newAssignment.courseSiteInfo.courseID;
    });

    // もし過去に保存した課題リストの中に講義IDが存在しない時
    if (idx === -1) {
      // 未読フラグを立ててマージ
      const isRead = newAssignment.assignmentEntries.length === 0;
      newAssignment.assignmentEntries.sort((a, b) => {
        return a.getDueDateTimestamp - b.getDueDateTimestamp;
      });
      mergedAssignmentList.push(new Assignment(newAssignment.courseSiteInfo, newAssignment.assignmentEntries, isRead));
    }
    // 過去に保存した課題リストの中に講義IDが存在する時
    else {
      // 未読フラグを引き継ぐ
      let isRead = oldAssignmentiList[idx].isRead;
      // 何も課題がない時は既読フラグをつける
      if (newAssignment.assignmentEntries.length === 0) isRead = true;

      let mergedAssignmentEntries = [];
      for (const newAssignmentEntry of newAssignment.assignmentEntries) {
        // 新しく取得した課題が保存された課題一覧の中にあるか探す
        const oldAssignment = oldAssignmentiList[idx] as Assignment;
        const q = oldAssignment.assignmentEntries.findIndex((oldAssignmentEntry) => {
          return oldAssignmentEntry.assignmentID === newAssignmentEntry.assignmentID;
        });
        // もしなければ新規課題なので未読フラグを立てる
        if (q === -1) {
          isRead = false;
          mergedAssignmentEntries.push(newAssignmentEntry);
        } else {
          const entry = new AssignmentEntry(
            newAssignmentEntry.assignmentID,
            newAssignmentEntry.assignmentTitle,
            newAssignmentEntry.dueDateTimestamp,
            newAssignmentEntry.closeDateTimestamp,
            newAssignmentEntry.isMemo,
            oldAssignment.assignmentEntries[q].isFinished,
            newAssignmentEntry.isQuiz,
            newAssignmentEntry.assignmentDetail
          );
          entry.assignmentPage = newAssignmentEntry.assignmentPage;
          mergedAssignmentEntries.push(entry);
        }
      }
      // 未読フラグ部分を変更してマージ
      mergedAssignmentEntries.sort((a, b) => {
        return a.getDueDateTimestamp - b.getDueDateTimestamp;
      });
      mergedAssignmentList.push(new Assignment(newAssignment.courseSiteInfo, mergedAssignmentEntries, isRead));
    }
  }
  return mergedAssignmentList;
}

function mergeIntoAssignmentList(targetAssignmentList: Array<Assignment>, newAssignmentList: Array<Assignment>): Array<Assignment>{
  const mergedAssignmentList = [];
  for (const assignment of targetAssignmentList) {
    mergedAssignmentList.push(new Assignment(assignment.courseSiteInfo, assignment.assignmentEntries, assignment.isRead));
  }
  for (const newAssignment of newAssignmentList) {
    const idx = targetAssignmentList.findIndex((assignment: Assignment) => {
      return newAssignment.courseSiteInfo.courseID === assignment.courseSiteInfo.courseID;
    });

    const mergedAssignment = mergedAssignmentList[idx] as Assignment;
    if (idx !== -1) {
      mergedAssignment.assignmentEntries = mergedAssignment.assignmentEntries.concat(newAssignment.assignmentEntries);
    } else {
      mergedAssignmentList.push(new Assignment(newAssignment.courseSiteInfo, newAssignment.assignmentEntries, true));
    }
  }
  return mergedAssignmentList;
}

function sortAssignmentList(assignmentList: Array<Assignment>): Array<Assignment> {
  return Array.from(assignmentList).sort((a, b) => {
    if (a.closestDueDateTimestamp > b.closestDueDateTimestamp) return 1;
    if (a.closestDueDateTimestamp < b.closestDueDateTimestamp) return -1;
    return 0;
  });
}

function useCache(fetchedTime: number | undefined, cacheInterval: number): boolean {
  if (fetchedTime) return (nowTime - fetchedTime) / 1000 <= cacheInterval;
  else return false;
}

function genUniqueStr(): string {
  return "m" + new Date().getTime().toString(16) + Math.floor(123456 * Math.random()).toString(16);
}

export {
  getDaysUntil,
  createCourseIDMap,
  formatTimestamp,
  isLoggedIn,
  miniSakaiReady,
  convertArrayToSettings,
  convertArrayToAssignment,
  compareAndMergeAssignmentList,
  updateIsReadFlag,
  useCache,
  genUniqueStr,
  mergeIntoAssignmentList,
  sortAssignmentList,
};
