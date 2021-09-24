import { loadFromStorage, saveToStorage } from "./storage";
import { Kadai, KadaiEntry, LectureInfo } from "./kadai";
import { fetchLectureIDs, getKadaiOfLectureID, getQuizOfLectureID } from "./network";
import {
  createHanburgerButton,
  createNavBarNotification,
  displayMiniPandA,
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

const baseURL = "https://panda.ecs.kyoto-u.ac.jp";
export const VERSION = "4.0.0α";
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
  const oldQuizList = await loadFromStorage("TSQuizList");
  let newKadaiList = [];
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
  } else {
    newKadaiList = oldKadaiList;
  }
  // 保存してあったものとマージする
  mergedKadaiListNoMemo = compareAndMergeKadaiList(oldKadaiList, newKadaiList);
  mergedKadaiList = compareAndMergeKadaiList(oldKadaiList, newKadaiList);

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
  } else {
    if (typeof oldQuizList !== "undefined") {
      newQuizList = oldQuizList;
    }
  }
  const mergedQuizList = compareAndMergeKadaiList(oldQuizList, newQuizList);

  // マージ後のkadaiListをストレージに保存する
  await saveToStorage("TSkadaiList", mergedKadaiListNoMemo);
  await saveToStorage("TSQuizList", mergedQuizList);

  mergedKadaiList = mergeIntoKadaiList(mergedKadaiList, mergedQuizList);

  // メモ一覧を読み込む
  const kadaiMemoList = convertArrayToKadai(await loadFromStorage("TSkadaiMemoList"));
  // さらにメモもマージする
  mergedKadaiList = mergeIntoKadaiList(mergedKadaiList, kadaiMemoList);
  mergedKadaiList = sortKadaiList(mergedKadaiList);

  return mergedKadaiList;
}

async function loadSettings() {
  CPsettings = await loadFromStorage("TSSettings");
  kadaiCacheInterval = CPsettings.kadaiCacheInterval ?? 60 * 2;
  quizCacheInterval = CPsettings.quizCacheInterval ?? 60 * 10;
  CPsettings.displayCheckedKadai = CPsettings.displayCheckedKadai ?? true;
  kadaiFetchedTime = await loadFromStorage("TSkadaiFetchedTime");
  quizFetchedTime = await loadFromStorage("TSquizFetchedTime");
}

async function loadLectureIDs() {
  lectureIDList = fetchLectureIDs()[1];
  await saveToStorage("TSlectureids", lectureIDList);
}

async function loadLectureIDsDemo() {
  lectureIDList = [
    new LectureInfo("default", "demo1", "サンプル講義1"),
    new LectureInfo("default", "demo2", "サンプル講義2"),
    new LectureInfo("default", "demo3", "サンプル講義3"),
    new LectureInfo("default", "demo4", "サンプル講義4"),
  ];
  return lectureIDList;
}

async function loadKadaiListDemo() {
  let date = new Date();
  let kadaiListDemo: Array<Kadai> = [];
  date.setHours(date.getHours() + 5);
  kadaiListDemo.push(
    new Kadai("demo1","",[new KadaiEntry("k1", "サンプル課題1", date.getTime()/1000, false, false, false)], false)
  );
  date.setDate(date.getDate() + 2);
  kadaiListDemo.push(
    new Kadai("demo2","",[new KadaiEntry("k2", "サンプル課題2", date.getTime()/1000, false, false, false)], false)
  );
  date.setDate(date.getDate() + 4);
  kadaiListDemo.push(
    new Kadai("demo3","",[new KadaiEntry("k3", "サンプル課題1", date.getTime()/1000, false, false, false)], false)
  );
  return kadaiListDemo;
}

async function main() {
  if (isLoggedIn()) {
    createHanburgerButton();
    await loadSettings();
    // await loadLectureIDs();
    await loadLectureIDsDemo();
    // mergedKadaiList = await loadAndMergeKadaiList(lectureIDList, useCache(kadaiFetchedTime, kadaiCacheInterval), useCache(quizFetchedTime, quizCacheInterval));
    mergedKadaiList = await loadKadaiListDemo();

    // await addMissingBookmarkedLectures();
    await displayMiniPandA(mergedKadaiList, lectureIDList);
    createNavBarNotification(lectureIDList, mergedKadaiList);

    miniPandAReady();
    updateIsReadFlag(mergedKadaiListNoMemo);
  }
}

main();
