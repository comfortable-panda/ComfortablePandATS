import { Kadai, LectureInfo } from './kadai';
import { loadFromStorage } from './storage'
import {
  convertArrayToKadai,
  mergeIntoKadaiList,
  sortKadaiList
} from "./utils";
import {
  lectureIDList
} from "./content_script"
import { createMiniPandAGeneralized } from "./minipanda"

const subpandaRoot = document.querySelector("#subpanda");

async function updateSubPandA(root: Element) {
  let mergedKadaiList: Array<Kadai>;

  const kadais = await loadFromStorage("TSkadaiList") as Array<Kadai>;
  const quizList = await loadFromStorage("TSQuizList") as Array<Kadai>;
  const kadaiMemoList = convertArrayToKadai(await loadFromStorage("TSkadaiMemoList"));
  const lectureIDs = await loadFromStorage("TSlectureids") as Array<LectureInfo>;
  mergedKadaiList = mergeIntoKadaiList(kadais, quizList);
  mergedKadaiList = mergeIntoKadaiList(mergedKadaiList, kadaiMemoList);
  mergedKadaiList = sortKadaiList(mergedKadaiList);

  createMiniPandAGeneralized(root, mergedKadaiList, lectureIDs, true, (rendered) => {
    console.log(rendered);
    root.innerHTML = rendered;
  });
}

function addSubPandAToPopup(): Element | null {
  if (subpandaRoot == null) return null;
  console.log(subpandaRoot);
  return subpandaRoot;
}

function initSubPandA() {
  const root = addSubPandAToPopup();
  root && updateSubPandA(root);
}

initSubPandA();
