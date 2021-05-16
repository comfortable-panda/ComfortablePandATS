import { loadFromStorage, saveToStorage } from "./storage";
import { Kadai, LectureInfo } from "./kadai";
import { fetchLectureIDs, getKadaiOfLectureID, getQuizOfLectureID } from "./network";
import {
  appendMemoBox,
  createHanburgerButton,
  createMiniPandA,
  createNavBarNotification,
  createSettingsTab,
  updateMiniPandA,
} from "./minipanda";
import { addMissingBookmarkedLectures } from "./bookmark";
import {
  compareAndMergeKadaiList,
  convertArrayToKadai,
  isLoggedIn,
  mergeIntoKadaiList,
  miniPandAReady,
  nowTime,
  sortKadaiList,
  updateIsReadFlag,
  useCache,
} from "./utils";
import { Settings } from "./settings";

export const VERSION = "3.4.0";
const baseURL = "https://panda.ecs.kyoto-u.ac.jp";
export let kadaiCacheInterval = 60 * 2;
export let quizCacheInterval = 60 * 10;
export let kadaiFetchedTime: number;
export let quizFetchedTime: number;
export let lectureIDList: Array<LectureInfo>;
export let mergedKadaiList: Array<Kadai>;
export let mergedKadaiListNoMemo: Array<Kadai>;
export let CPsettings: Settings;

export async function loadAndMergeKadaiList(lectureIDList: Array<LectureInfo>, useKadaiCache: boolean, useQuizCache: boolean): Promise<Array<Kadai>> {
  // ストレージから前回保存したkadaiListを読み込む
  const oldKadaiList = await loadFromStorage("TSkadaiList");
  const newKadaiList = [];
  const oldQuizList = await loadFromStorage("TSQuizList");
  let newQuizList = [];

  if (useKadaiCache) {
    console.log("Loading assignments...");
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
    await saveToStorage("TSkadaiFetchedTime", nowTime);
    kadaiFetchedTime = nowTime;

    // 保存してあったものとマージする
    mergedKadaiListNoMemo = compareAndMergeKadaiList(oldKadaiList, newKadaiList);
    mergedKadaiList = compareAndMergeKadaiList(oldKadaiList, newKadaiList);
  } else {
    mergedKadaiListNoMemo = compareAndMergeKadaiList(oldKadaiList, oldKadaiList);
    mergedKadaiList = compareAndMergeKadaiList(oldKadaiList, oldKadaiList);
  }

  if (useQuizCache) {
    console.log("Loading quizzes...");
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
    await saveToStorage("TSquizFetchedTime", nowTime);
    quizFetchedTime = nowTime;
    await saveToStorage("TSQuizList", newQuizList);
  } else {
    if(typeof oldKadaiList !== "undefined"){
      newQuizList = oldQuizList;
    }
  }

  // マージ後のkadaiListをストレージに保存する
  await saveToStorage("TSkadaiList", mergedKadaiListNoMemo);

  mergedKadaiList = mergeIntoKadaiList(mergedKadaiList, newQuizList);

  // メモ一覧を読み込む
  const kadaiMemoList = convertArrayToKadai(await loadFromStorage("TSkadaiMemoList"));
  // さらにメモもマージする
  mergedKadaiList = mergeIntoKadaiList(mergedKadaiList, kadaiMemoList);
  mergedKadaiList = sortKadaiList(mergedKadaiList);

  return mergedKadaiList;
}

export async function displayMiniPandA(mergedKadaiList: Array<Kadai>, lectureIDList: Array<LectureInfo>): Promise<void>{
  createMiniPandA();
  appendMemoBox(lectureIDList);
  createSettingsTab();
  updateMiniPandA(mergedKadaiList, lectureIDList);
}

async function saveCacheOfLectureIDs(lectureIDs: Array<LectureInfo>) {
  saveToStorage("TSlectureids", lectureIDs);
}

async function loadSettings(){
  CPsettings = await loadFromStorage("TSSettings");
  kadaiCacheInterval = CPsettings.kadaiCacheInterval ?? 60 * 2;
  quizCacheInterval = CPsettings.quizCacheInterval ?? 60 * 10;
  CPsettings.displayCheckedKadai = CPsettings.displayCheckedKadai ?? true;
}

async function main() {
  if (isLoggedIn()) {
    createHanburgerButton();
    await loadSettings();
    kadaiFetchedTime = await loadFromStorage("TSkadaiFetchedTime");
    quizFetchedTime = await loadFromStorage("TSquizFetchedTime");
    lectureIDList = fetchLectureIDs()[1];
    mergedKadaiList = await loadAndMergeKadaiList(lectureIDList, useCache(kadaiFetchedTime, kadaiCacheInterval), useCache(quizFetchedTime, quizCacheInterval));
    await saveCacheOfLectureIDs(lectureIDList);

    await displayMiniPandA(mergedKadaiList, lectureIDList);

    miniPandAReady();
    updateIsReadFlag(mergedKadaiListNoMemo);
    await addMissingBookmarkedLectures();
    createNavBarNotification(lectureIDList, mergedKadaiList);
  }
}

main();
