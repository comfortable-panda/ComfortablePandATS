import { Kadai, KadaiEntry, LectureInfo } from "./kadai";
import { DueGroupDom } from "./dom";
import lectureName = DueGroupDom.lectureName;
import { saveToStorage } from "./storage";

export const nowTime = new Date().getTime();
const cacheInterval = 120;

function getDaysUntil(dt1: number, dt2: number): number {
  // 締め切りまでの日数を計算します
  let diff = (dt2 - dt1) / 1000;
  diff /= 3600 * 24;
  if (diff < 0) diff = 9999;
  return diff;
}

function getTimeRemain(_remainTime: number): [number, number, number] {
  const day = Math.floor(_remainTime / (3600 * 24));
  const hours = Math.floor((_remainTime - day * 3600 * 24) / 3600);
  const minutes = Math.floor((_remainTime - (day * 3600 * 24 + hours * 3600)) / 60);
  return [day, hours, minutes];
}

// TODO: dom.tsに移動したい
function createElem(tag: any, dict?: { [key: string]: any }): any {
  const elem = document.createElement(tag);
  for (const key in dict) {
    // @ts-ignore
    elem[key] = dict[key];
  }
  return elem;
}

function appendChildAll(to: HTMLElement, arr: Array<any>): HTMLElement {
  for (const obj in arr) {
    to.appendChild(arr[obj]);
  }
  return to;
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
    console.log("フラグをへし折りました！")
    saveToStorage("kadaiList", updatedKadaiList);
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
    for (const e of i.kadaiEntries){
      const entry = new KadaiEntry(e.kadaiID, e.assignmentTitle, e.dueDateTimestamp, e.isMemo, e.isFinished, e.assignmentDetail);
      entry.kadaiPage = e.kadaiPage;
      kadaiEntries.push(entry);
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
      mergedKadaiList.push(new Kadai(newKadai.lectureID, newKadai.lectureName, newKadai.kadaiEntries, false));
    }
    // 過去に保存した課題リストの中に講義IDが存在する時
    else {
      // 未読フラグを引き継ぐ
      let isRead = oldKadaiList[idx].isRead;
      let mergedKadaiEntries = [];
      for (const newKadaiEntry of newKadai.kadaiEntries){
        // 新しく取得した課題が保存された課題一覧の中にあるか探す
        const q = oldKadaiList[idx].kadaiEntries.findIndex((oldKadaiEntry) => {
          return (oldKadaiEntry.kadaiID === newKadaiEntry.kadaiID)
        });
        // もしなければ新規課題なので未読フラグを立てる
        if (q === -1) {
          isRead = false;
          console.log("cannnot find");
          mergedKadaiEntries.push(newKadaiEntry);
        } else {
          const entry = new KadaiEntry(
            newKadaiEntry.kadaiID,
            newKadaiEntry.assignmentTitle,
            newKadaiEntry.dueDateTimestamp,
            newKadaiEntry.isMemo,
            oldKadaiList[idx].kadaiEntries[q].isFinished,
            newKadaiEntry.assignmentDetail
          );
          entry.kadaiPage = newKadaiEntry.kadaiPage;
          mergedKadaiEntries.push(entry)
        };
      }
      // 未読フラグ部分を変更してマージ
      mergedKadaiList.push(new Kadai(newKadai.lectureID, newKadai.lectureName, mergedKadaiEntries, isRead));
    }
  }
  return mergedKadaiList;
}

function mergeMemoIntoKadaiList(kadaiList: Array<Kadai>, kadaiMemoList: Array<Kadai>): Array<Kadai>{
  let mergedKadaiList = kadaiList;
  for (const kadaiMemo of kadaiMemoList){
    const idx = kadaiList.findIndex((kadai) => {
      return (kadaiMemo.lectureID === kadai.lectureID)
    });
    if (idx !== -1) {
      mergedKadaiList[idx].kadaiEntries = mergedKadaiList[idx].kadaiEntries.concat(kadaiMemo.kadaiEntries);
    } else {
      mergedKadaiList.push(new Kadai(kadaiMemo.lectureID, kadaiMemo.lectureName, kadaiMemo.kadaiEntries, true));
    }
  }
  return mergedKadaiList;
}

function useCache(fetchedTime: number): boolean{
  return (nowTime - fetchedTime) / 1000 > cacheInterval;
}

function genUniqueStr() {
  return "m" + new Date().getTime().toString(16) + Math.floor(123456 * Math.random()).toString(16);
}


export {
  getDaysUntil,
  getTimeRemain,
  createElem,
  appendChildAll,
  createLectureIDMap,
  isLoggedIn,
  miniPandAReady,
  convertArrayToKadai,
  compareAndMergeKadaiList,
  updateIsReadFlag,
  useCache,
  genUniqueStr,
  mergeMemoIntoKadaiList,
};
