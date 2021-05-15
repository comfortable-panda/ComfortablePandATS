import { loadFromStorage, saveToStorage } from "./storage";
import { Kadai, LectureInfo } from "./kadai";
import { fetchLectureIDs, getKadaiOfLectureID, getQuizOfLectureID } from "./network";
import {
  appendMemoBox,
  createHanburgerButton,
  createMiniPandA,
  createNavBarNotification,
  updateMiniPandA,
} from "./minipanda";
import { addMissingBookmarkedLectures } from "./bookmark";
import {
  compareAndMergeKadaiList,
  convertArrayToKadai,
  isLoggedIn, kadaiCacheInterval,
  mergeMemoIntoKadaiList,
  miniPandAReady,
  nowTime, quizCacheInterval,
  sortKadaiList,
  updateIsReadFlag,
  useCache
} from "./utils";

const baseURL = "https://panda.ecs.kyoto-u.ac.jp";
export let kadaiFetchedTime: number;
export let quizFetchedTime: number;
export let lectureIDList: Array<LectureInfo>;
export let mergedKadaiList: Array<Kadai>;
export let mergedKadaiListNoMemo: Array<Kadai>;

async function loadAndMergeKadaiList(lectureIDList: Array<LectureInfo>, useKadaiCache: boolean, useQuizCache: boolean): Promise<Array<Kadai>> {
  // ストレージから前回保存したkadaiListを読み込む
  const oldKadaiList = await loadFromStorage("TSkadaiList");
  const newKadaiList = [];
  const oldQuizList = await loadFromStorage("TSQuizList");
  let newQuizList = [];

  if (useKadaiCache) {
    console.log("課題キャッシュなし");
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
    console.log("課題キャッシュあり");
    mergedKadaiListNoMemo = compareAndMergeKadaiList(oldKadaiList, oldKadaiList);
    mergedKadaiList = compareAndMergeKadaiList(oldKadaiList, oldKadaiList);
  }

  if (useQuizCache) {
    console.log("クイズキャッシュなし");
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
      newQuizList = oldQuizList
    }
    console.log("old quiz", oldQuizList)
  }

  // マージ後のkadaiListをストレージに保存する
  await saveToStorage("TSkadaiList", mergedKadaiListNoMemo);

  mergedKadaiList = mergeMemoIntoKadaiList(mergedKadaiList, newQuizList);

  // メモ一覧を読み込む
  const kadaiMemoList = convertArrayToKadai(await loadFromStorage("TSkadaiMemoList"));
  // さらにメモもマージする
  mergedKadaiList = mergeMemoIntoKadaiList(mergedKadaiList, kadaiMemoList);
  mergedKadaiList = sortKadaiList(mergedKadaiList);

  return mergedKadaiList;
}

export async function displayMiniPandA(mergedKadaiList: Array<Kadai>, lectureIDList: Array<LectureInfo>): Promise<void>{
  createMiniPandA();
  appendMemoBox(lectureIDList);
  updateMiniPandA(mergedKadaiList, lectureIDList);
}

async function saveCacheOfLectureIDs(lectureIDs: Array<LectureInfo>) {
  saveToStorage("TSlectureids", lectureIDs);
}

async function main() {
  if (isLoggedIn()) {
    createHanburgerButton();
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
