import { Assignment, AssignmentEntry, CourseSiteInfo } from "./model";
import { saveToLocalStorage } from "./storage";

export const nowTime = new Date().getTime();

function getDaysUntil(dt1: number, dt2: number): number {
  // 締め切りまでの日数を計算します
  let diff = (dt2 - dt1) / 1000;
  diff /= 3600 * 24;
  return diff;
}

function getTimeRemain(_remainTime: number): [number, number, number] {
  const day = Math.floor(_remainTime / (3600 * 24));
  const hours = Math.floor((_remainTime - day * 3600 * 24) / 3600);
  const minutes = Math.floor((_remainTime - (day * 3600 * 24 + hours * 3600)) / 60);
  return [day, hours, minutes];
}

function formatTimestamp(timestamp: number): string {
  const _date = new Date(timestamp * 1000);
  return _date.toLocaleDateString() + " " + _date.getHours() + ":" + ("00" + _date.getMinutes()).slice(-2);
}

function createCourseIDMap(courseSiteInfos: Array<CourseSiteInfo>): Map<string, string> {
  // 講義IDと講義名のMapを作る
  const courseIDMap = new Map<string, string>();
  for (const courseSiteInfo of courseSiteInfos) {
    courseIDMap.set(courseSiteInfo.courseID, courseSiteInfo.courseName);
  }
  return courseIDMap;
}

function isLoggedIn(): boolean {
  // ログインしているかどうかを返す
  const scripts = document.getElementsByTagName("script");
  let loggedIn = false;
  // @ts-ignore
  for (const script of scripts) {
    if (script.text.match('"loggedIn": true')) loggedIn = true;
  }
  return loggedIn;
}

function getSiteCourseID() {
  // 現在のページの講義IDを返す
  const url = location.href;
  let courseID = "";
  const reg = new RegExp("(https?://[^/]+)/portal/site/([^/]+)");
  if (url.match(reg)) {
    // @ts-ignore
    courseID = url.match(reg)[2];
  }
  return courseID;
}

function updateIsReadFlag(kadaiList: Array<Assignment>): void {
  const courseID = getSiteCourseID();
  const updatedKadaiList = [];
  if (courseID && courseID.length >= 17) {
    for (const kadai of kadaiList) {
      if (kadai.courseSiteInfo.courseID === courseID) {
        updatedKadaiList.push(new Assignment(kadai.courseSiteInfo, kadai.assignmentEntries, true));
      } else {
        updatedKadaiList.push(kadai);
      }
    }
    saveToLocalStorage("TSkadaiList", updatedKadaiList);
  }
}

function miniSakaiReady(): void {
  // ロード表示を切り替えて3本線表示にする
  const hamburger = document.getElementsByClassName("loader")[0];
  hamburger.className = "";
  hamburger.id = "hamburger";
  hamburger.textContent = "☰";
}

function convertArrayToKadai(arr: Array<any>): Array<Assignment>{
  const kadaiList = [];
  for (const i of arr) {
    const kadaiEntries = [];
    for (const e of i.assignmentEntries) {
      const entry = new AssignmentEntry(e.assignmentID, e.assignmentTitle, e.dueDateTimestamp, e.isMemo, e.isFinished, e.isQuiz ,e.assignmentDetail);
      entry.assignmentPage = e.kadaiPage;
      if (entry.dueDateTimestamp * 1000 > nowTime) kadaiEntries.push(entry);
    }
    kadaiList.push(new Assignment(new CourseSiteInfo(i.courseSiteInfo.courseID, i.courseSiteInfo.courseName), kadaiEntries, i.isRead))
  }
  return kadaiList;
}

function compareAndMergeKadaiList(oldKadaiList: Array<Assignment>, newKadaiList: Array<Assignment>): Array<Assignment>{
  const mergedKadaiList = [];

  // 最新の課題リストをもとにマージする
  for (const newKadai of newKadaiList){
    const idx = oldKadaiList.findIndex((oldKadai: Assignment) => {
      return (oldKadai.courseSiteInfo.courseID === newKadai.courseSiteInfo.courseID)
    });

    // もし過去に保存した課題リストの中に講義IDが存在しない時
    if (idx === -1) {
      // 未読フラグを立ててマージ
      const isRead = newKadai.assignmentEntries.length === 0;
      newKadai.assignmentEntries.sort((a, b) => {
        return a.dueDateTimestamp - b.dueDateTimestamp;
      });
      mergedKadaiList.push(new Assignment(newKadai.courseSiteInfo, newKadai.assignmentEntries, isRead));
    }
    // 過去に保存した課題リストの中に講義IDが存在する時
    else {
      // 未読フラグを引き継ぐ
      let isRead = oldKadaiList[idx].isRead;
      // 何も課題がない時は既読フラグをつける
      if (newKadai.assignmentEntries.length === 0) isRead = true;

      let mergedKadaiEntries = [];
      for (const newKadaiEntry of newKadai.assignmentEntries){
        // 新しく取得した課題が保存された課題一覧の中にあるか探す
        const oldAssignment = oldKadaiList[idx] as Assignment;
        const q = oldAssignment.assignmentEntries.findIndex((oldKadaiEntry) => {
          return oldKadaiEntry.assignmentID === newKadaiEntry.assignmentID;
        });
        // もしなければ新規課題なので未読フラグを立てる
        if (q === -1) {
          isRead = false;
          mergedKadaiEntries.push(newKadaiEntry);
        } else {
          const entry = new AssignmentEntry(
            newKadaiEntry.assignmentID,
            newKadaiEntry.assignmentTitle,
            newKadaiEntry.dueDateTimestamp,
            newKadaiEntry.isMemo,
            oldAssignment.assignmentEntries[q].isFinished,
            newKadaiEntry.isQuiz,
            newKadaiEntry.assignmentDetail
          );
          entry.assignmentPage = newKadaiEntry.assignmentPage;
          mergedKadaiEntries.push(entry);
        }
      }
      // 未読フラグ部分を変更してマージ
      mergedKadaiEntries.sort((a, b) => {return a.dueDateTimestamp - b.dueDateTimestamp});
      mergedKadaiList.push(new Assignment(newKadai.courseSiteInfo, mergedKadaiEntries, isRead));
    }
  }
  return mergedKadaiList;
}

function mergeIntoKadaiList(targetKadaiList: Array<Assignment>, newKadaiList: Array<Assignment>): Array<Assignment>{
  const mergedKadaiList = [];
  for (const kadai of targetKadaiList){
    mergedKadaiList.push(new Assignment(kadai.courseSiteInfo, kadai.assignmentEntries, kadai.isRead));
  }
  for (const kadaiList of newKadaiList){
    const idx = targetKadaiList.findIndex((kadai: Assignment) => {
      return kadaiList.courseSiteInfo.courseID === kadai.courseSiteInfo.courseID;
    });

    const mergedAssignment = mergedKadaiList[idx] as Assignment;
    if (idx !== -1) {
      mergedAssignment.assignmentEntries = mergedAssignment.assignmentEntries.concat(kadaiList.assignmentEntries);
    } else {
      mergedKadaiList.push(new Assignment(kadaiList.courseSiteInfo, kadaiList.assignmentEntries, true));
    }
  }
  return mergedKadaiList;
}

function sortKadaiList(kadaiList: Array<Assignment>): Array<Assignment> {
  return Array.from(kadaiList).sort((a, b) => {
    if (a.closestDueDateTimestamp > b.closestDueDateTimestamp) return 1;
    if (a.closestDueDateTimestamp < b.closestDueDateTimestamp) return -1;
    return 0;
  });
}

function useCache(fetchedTime: number, cacheInterval: number): boolean{
  return (nowTime - fetchedTime) / 1000 <= cacheInterval;
}

function genUniqueStr(): string {
  return "m" + new Date().getTime().toString(16) + Math.floor(123456 * Math.random()).toString(16);
}

export {
  getDaysUntil,
  getTimeRemain,
  formatTimestamp,
  createCourseIDMap,
  isLoggedIn,
  miniSakaiReady,
  convertArrayToKadai,
  compareAndMergeKadaiList,
  updateIsReadFlag,
  useCache,
  genUniqueStr,
  mergeIntoKadaiList,
  sortKadaiList,
};
