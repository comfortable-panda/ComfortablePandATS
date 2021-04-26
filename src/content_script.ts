import { loadFromStorage, saveToStorage } from "./storage";
import { Kadai, LectureInfo } from "./kadai";
import { fetchLectureIDs, getKadaiOfLectureID } from "./network";
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
  isLoggedIn,
  mergeMemoIntoKadaiList,
  miniPandAReady,
  nowTime,
  sortKadaiList,
  updateIsReadFlag,
  useCache
} from "./utils";

const baseURL = "https://panda.ecs.kyoto-u.ac.jp";
export let fetchedTime: number;
export let lectureIDList: Array<LectureInfo>;
export let mergedKadaiList: Array<Kadai>;
export let mergedKadaiListNoMemo: Array<Kadai>;

async function loadAndMergeKadaiList(lectureIDList: Array<LectureInfo>, useCache: boolean): Promise<Array<Kadai>> {
  // ストレージから前回保存したkadaiListを読み込む
  const oldKadaiList = await loadFromStorage("TSkadaiList");
  const newKadaiList = [];

  if (useCache) {
    console.log("キャッシュなし");
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

    // 保存してあったものとマージする
    mergedKadaiListNoMemo = compareAndMergeKadaiList(oldKadaiList, newKadaiList);
    mergedKadaiList = compareAndMergeKadaiList(oldKadaiList, newKadaiList);
  } else {
    console.log("キャッシュあり");
    mergedKadaiListNoMemo = compareAndMergeKadaiList(oldKadaiList, oldKadaiList);
    mergedKadaiList = compareAndMergeKadaiList(oldKadaiList, oldKadaiList);
  }

  // マージ後のkadaiListをストレージに保存する
  await saveToStorage("TSkadaiList", mergedKadaiListNoMemo);

  // メモ一覧を読み込む
  const kadaiMemoList = convertArrayToKadai(await loadFromStorage("TSkadaiMemoList"));
  // さらにメモもマージする
  mergedKadaiList = mergeMemoIntoKadaiList(mergedKadaiList, kadaiMemoList);
  mergedKadaiList = sortKadaiList(mergedKadaiList);

  return mergedKadaiList;
}

export async function displayMiniPandA(mergedKadaiList: Array<Kadai>, lectureIDList: Array<LectureInfo>, fetchedTime: number): Promise<void>{
  createMiniPandA(useCache(fetchedTime) ? nowTime : fetchedTime);
  appendMemoBox(lectureIDList);
  updateMiniPandA(mergedKadaiList, lectureIDList);
}

async function main() {
  if (isLoggedIn()) {
    createHanburgerButton();
    fetchedTime = await loadFromStorage("TSkadaiFetchedTime");
    lectureIDList = fetchLectureIDs()[1];
    mergedKadaiList = await loadAndMergeKadaiList(lectureIDList, useCache(fetchedTime));

    await displayMiniPandA(mergedKadaiList, lectureIDList, fetchedTime);

    miniPandAReady();
    updateIsReadFlag(mergedKadaiListNoMemo);
    await addMissingBookmarkedLectures();
    createNavBarNotification(lectureIDList, mergedKadaiList);
  }
}

main();
