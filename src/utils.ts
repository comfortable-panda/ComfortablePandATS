import { Kadai, KadaiEntry, LectureInfo } from "./kadai";
import { saveToStorage } from "./storage";

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

function createLectureIDMap(lectureIDList: Array<LectureInfo>): Map<string, string> {
  // 講義IDと講義名のMapを作る
  const lectureIDMap = new Map<string, string>();
  for (const lec of lectureIDList) {
    lectureIDMap.set(lec.lectureID, lec.lectureName);
  }
  return lectureIDMap;
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

function getCurrentLectureID() {
  // 現在のページの講義IDを返す
  const url = location.href;
  let lectureID = "";
  const reg = new RegExp("(https?://[^/]+)/portal/site/([^/]+)");
  if (url.match(reg)){
    // @ts-ignore
    lectureID = url.match(reg)[2];
  }
  return lectureID;
}

function updateIsReadFlag(kadaiList: Array<Kadai>): void {
  const lectureID = getCurrentLectureID();
  const updatedKadaiList = [];
  if (lectureID && lectureID.length >= 17) {
    for (const kadai of kadaiList){
      if (kadai.lectureID === lectureID){
        updatedKadaiList.push(new Kadai(kadai.lectureID, kadai.lectureName, kadai.kadaiEntries, true));
      }else{
        updatedKadaiList.push(kadai);
      }
    }
    saveToStorage("TSkadaiList", updatedKadaiList);
  }
}

function miniPandAReady(): void {
  // ロード表示を切り替えて3本線表示にする
  const hamburger = document.getElementsByClassName("loader")[0];
  hamburger.className = "";
  hamburger.id = "hamburger";
  hamburger.textContent = "☰";
}

function convertArrayToKadai(arr: Array<any>): Array<Kadai>{
  const kadaiList = [];
  for (const i of arr) {
    const kadaiEntries = [];
    for (const e of i.kadaiEntries) {
      const entry = new KadaiEntry(e.kadaiID, e.assignmentTitle, e.dueDateTimestamp, e.isMemo, e.isFinished, e.isQuiz ,e.assignmentDetail);
      entry.kadaiPage = e.kadaiPage;
      if (entry.dueDateTimestamp * 1000 > nowTime) kadaiEntries.push(entry);
    }
    kadaiList.push(new Kadai(i.lectureID, i.lectureName, kadaiEntries, i.isRead))
  }
  return kadaiList;
}

function compareAndMergeKadaiList(oldKadaiList: Array<Kadai>, newKadaiList: Array<Kadai>): Array<Kadai>{
  const mergedKadaiList = [];

  // 最新の課題リストをもとにマージする
  for (const newKadai of newKadaiList){
    const idx = oldKadaiList.findIndex((oldKadai) => {
      return (oldKadai.lectureID === newKadai.lectureID)
    });

    // もし過去に保存した課題リストの中に講義IDが存在しない時
    if (idx === -1) {
      // 未読フラグを立ててマージ
      const isRead = newKadai.kadaiEntries.length === 0;
      newKadai.kadaiEntries.sort((a, b)=>{return a.dueDateTimestamp - b.dueDateTimestamp});
      mergedKadaiList.push(new Kadai(newKadai.lectureID, newKadai.lectureName, newKadai.kadaiEntries, isRead));
    }
    // 過去に保存した課題リストの中に講義IDが存在する時
    else {
      // 未読フラグを引き継ぐ
      let isRead = oldKadaiList[idx].isRead;
      // 何も課題がない時は既読フラグをつける
      if (newKadai.kadaiEntries.length === 0) isRead = true;

      let mergedKadaiEntries = [];
      for (const newKadaiEntry of newKadai.kadaiEntries){
        // 新しく取得した課題が保存された課題一覧の中にあるか探す
        const q = oldKadaiList[idx].kadaiEntries.findIndex((oldKadaiEntry) => {
          return (oldKadaiEntry.kadaiID === newKadaiEntry.kadaiID)
        });
        // もしなければ新規課題なので未読フラグを立てる
        if (q === -1) {
          isRead = false;
          mergedKadaiEntries.push(newKadaiEntry);
        } else {
          const entry = new KadaiEntry(
            newKadaiEntry.kadaiID,
            newKadaiEntry.assignmentTitle,
            newKadaiEntry.dueDateTimestamp,
            newKadaiEntry.isMemo,
            oldKadaiList[idx].kadaiEntries[q].isFinished,
            newKadaiEntry.isQuiz,
            newKadaiEntry.assignmentDetail
          );
          entry.kadaiPage = newKadaiEntry.kadaiPage;
          mergedKadaiEntries.push(entry);
        }
      }
      // 未読フラグ部分を変更してマージ
      mergedKadaiEntries.sort((a, b)=>{return a.dueDateTimestamp - b.dueDateTimestamp});
      mergedKadaiList.push(new Kadai(newKadai.lectureID, newKadai.lectureName, mergedKadaiEntries, isRead));
    }
  }
  return mergedKadaiList;
}

function mergeIntoKadaiList(targetKadaiList: Array<Kadai>, newKadaiList: Array<Kadai>): Array<Kadai>{
  const mergedKadaiList = [];
  for (const kadai of targetKadaiList){
    mergedKadaiList.push(new Kadai(kadai.lectureID, kadai.lectureName, kadai.kadaiEntries, kadai.isRead));
  }
  for (const kadaiList of newKadaiList){
    const idx = targetKadaiList.findIndex((kadai) => {
      return (kadaiList.lectureID === kadai.lectureID)
    });
    if (idx !== -1) {
      mergedKadaiList[idx].kadaiEntries = mergedKadaiList[idx].kadaiEntries.concat(kadaiList.kadaiEntries);
    } else {
      mergedKadaiList.push(new Kadai(kadaiList.lectureID, kadaiList.lectureName, kadaiList.kadaiEntries, true));
    }
  }
  return mergedKadaiList;
}

function sortKadaiList(kadaiList: Array<Kadai>): Array<Kadai> {
  return Array.from(kadaiList).sort((a, b) => {
    if (a.closestDueDateTimestamp > b.closestDueDateTimestamp) return 1;
    if (a.closestDueDateTimestamp < b.closestDueDateTimestamp) return -1;
    return 0;
  });
}

function useCache(fetchedTime: number, cacheInterval: number): boolean{
  return (nowTime - fetchedTime) / 1000 > cacheInterval;
}

function genUniqueStr(): string {
  return "m" + new Date().getTime().toString(16) + Math.floor(123456 * Math.random()).toString(16);
}

export {
  getDaysUntil,
  getTimeRemain,
  createLectureIDMap,
  isLoggedIn,
  miniPandAReady,
  convertArrayToKadai,
  compareAndMergeKadaiList,
  updateIsReadFlag,
  useCache,
  genUniqueStr,
  mergeIntoKadaiList,
  sortKadaiList,
};
