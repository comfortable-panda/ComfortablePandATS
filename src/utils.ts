import { LectureInfo } from "./kadai";
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


export { getDaysUntil, getTimeRemain, createElem, appendChildAll, createLectureIDMap, isLoggedIn, miniPandAReady }