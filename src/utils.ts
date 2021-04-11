import { Kadai, KadaiEntry, LectureInfo } from "./kadai";
import { DueGroupDom } from "./dom";
import lectureName = DueGroupDom.lectureName;

export const nowTime = new Date().getTime();

function getDaysUntil(dt1: number, dt2: number): number {
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

function createLectureIDMap(lectureIDList: Array<LectureInfo>): Map<string, string>{
  const lectureIDMap = new Map<string, string>();
  for (const lec of lectureIDList) {
    lectureIDMap.set(lec.lectureID, lec.lectureName);
  }
  return lectureIDMap;
}

function isLoggedIn(): boolean{
  const scripts = document.getElementsByTagName("script");
  let loggedIn = false;
  // @ts-ignore
  for (const script of scripts) {
    if (script.text.match('"loggedIn": true')) loggedIn = true;
  }
  return loggedIn;
}

function miniPandAReady(): void {
  // ロード表示を切り替えて3本線表示にする
  const hamburger = document.getElementsByClassName("loader")[0];
  hamburger.className = "";
  hamburger.id = "hamburger";
  hamburger.textContent = "☰";
}

function convertArrayToKadai(arr: Array<any>): Array<Kadai>{
  const kadaiList = []
  for (const i of arr){
    const kadaiEntries = [];
    for (const e of i.kadaiEntries){
      kadaiEntries.push(new KadaiEntry(e.kadaiID, e.assignmentTitle, e.assignmentDetail, e.dueDateTimestamp, e.isMemo, e.isFinished));
    }
    kadaiList.push(new Kadai(i.lectureID, i.lectureName, kadaiEntries, i.isRead))
  }
  return kadaiList
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
      // 未読フラグを下げる
      let isRead = true;
      for (const newKadaiEntry of newKadai.kadaiEntries){
        // 新しく取得した課題が保存された課題一覧の中にあるか探す
        const q = oldKadaiList[idx].kadaiEntries.findIndex((oldKadaiEntry) => {
          return (oldKadaiEntry.kadaiID === newKadaiEntry.kadaiID)
        });
        // もしなければ新規課題なので未読フラグを立てる
        if (q === -1) isRead = false;
      }
      // 未読フラグ部分を変更してマージ
      mergedKadaiList.push(new Kadai(newKadai.lectureID, newKadai.lectureName, newKadai.kadaiEntries, isRead));
    }
  }
  return mergedKadaiList;
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
};
