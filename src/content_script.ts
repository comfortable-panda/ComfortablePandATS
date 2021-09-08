import { loadFromLocalStorage, saveToLocalStorage } from "./storage";
import { Kadai, LectureInfo } from "./kadai";
import {
  fetchLectureIDs,
  getKadaiOfLectureID,
  getQuizOfLectureID,
} from "./network";
import {
  createMiniSakaiBtn,
  createNavBarNotification,
  displayMiniPandA,
} from "./minipanda";
import { addBookmarkedCourseSites } from "./bookmark";
import {
  compareAndMergeKadaiList,
  convertArrayToKadai,
  isLoggedIn,
  mergeIntoKadaiList,
  miniSakaiReady,
  nowTime,
  sortKadaiList,
  updateIsReadFlag,
  useCache,
} from "./utils";
import { DefaultSettings, Settings } from "./settings";

export const baseURL = "https://panda.ecs.kyoto-u.ac.jp";
export const VERSION = "1.0.0";
export let kadaiCacheInterval: number;
export let quizCacheInterval: number;
export let kadaiFetchedTime: number;
export let quizFetchedTime: number;
export let lectureIDList: Array<LectureInfo>;
export let mergedKadaiList: Array<Kadai>;
export let mergedKadaiListNoMemo: Array<Kadai>;
export let CPsettings: Settings;

export async function loadAndMergeKadaiList(lectureIDList: Array<LectureInfo>, useKadaiCache: boolean, useQuizCache: boolean): Promise<Array<Kadai>> {
  // ストレージから前回保存したkadaiListを読み込む
  const oldKadaiList = await loadFromLocalStorage("TSkadaiList");
  const oldQuizList = await loadFromLocalStorage("TSQuizList");
  let newKadaiList = [];
  let newQuizList = [];

  if (useKadaiCache) {
    newKadaiList = oldKadaiList;
  } else {
    console.log("Fetching assignments...");
    const pendingList = [];
    // 課題取得待ちリストに追加
    for (const i of lectureIDList) {
      pendingList.push(getKadaiOfLectureID(baseURL, i.lectureID));
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
  mergedKadaiListNoMemo = compareAndMergeKadaiList(oldKadaiList, newKadaiList);
  mergedKadaiList = compareAndMergeKadaiList(oldKadaiList, newKadaiList);

  if (useQuizCache) {
    if (typeof oldQuizList !== "undefined") {
      newQuizList = oldQuizList;
    }
  } else {
    console.log("Fetching quizzes...");
    const pendingList = [];
    // クイズ取得待ちリストに追加
    for (const i of lectureIDList) {
      pendingList.push(getQuizOfLectureID(baseURL, i.lectureID));
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
  const mergedQuizList = compareAndMergeKadaiList(oldQuizList, newQuizList);

  // マージ後のkadaiListをストレージに保存する
  await saveToLocalStorage("TSkadaiList", mergedKadaiListNoMemo);
  await saveToLocalStorage("TSQuizList", mergedQuizList);

  mergedKadaiList = mergeIntoKadaiList(mergedKadaiList, mergedQuizList);

  // メモ一覧を読み込む
  const kadaiMemoList = convertArrayToKadai(await loadFromLocalStorage("TSkadaiMemoList"));
  // さらにメモもマージする
  mergedKadaiList = mergeIntoKadaiList(mergedKadaiList, kadaiMemoList);
  mergedKadaiList = sortKadaiList(mergedKadaiList);

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

async function loadLectureIDs() {
  lectureIDList = fetchLectureIDs()[1];
  await saveToLocalStorage("TSlectureids", lectureIDList);
}

async function main() {
  if (isLoggedIn()) {
    createMiniSakaiBtn();
    await loadSettings();
    await loadLectureIDs();
    mergedKadaiList = await loadAndMergeKadaiList(lectureIDList, useCache(kadaiFetchedTime, kadaiCacheInterval), useCache(quizFetchedTime, quizCacheInterval));

    await addBookmarkedCourseSites(baseURL);
    await displayMiniPandA(mergedKadaiList, lectureIDList);
    createNavBarNotification(lectureIDList, mergedKadaiList);

    miniSakaiReady();
    updateIsReadFlag(mergedKadaiListNoMemo);
  }
}

main();
