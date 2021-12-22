import { Assignment, CourseSiteInfo } from "./model";
import { loadFromLocalStorage } from "./storage";
import { convertArrayToAssignment, mergeIntoAssignmentList, sortAssignmentList } from "./utils";
import { createMiniSakaiGeneralized } from "./minisakai";

const subpandaRoot = document.querySelector("#subpanda");

async function updateSubPandA(root: Element) {
  let mergedKadaiList: Array<Assignment>;

  const kadais = (await loadFromLocalStorage("TSkadaiList")) as Array<Assignment>;
  const quizList = (await loadFromLocalStorage("TSQuizList")) as Array<Assignment>;
  const kadaiMemoList = convertArrayToAssignment(await loadFromLocalStorage("TSkadaiMemoList"));
  const lectureIDs = (await loadFromLocalStorage("TSlectureids")) as Array<CourseSiteInfo>;
  mergedKadaiList = mergeIntoAssignmentList(kadais, quizList);
  mergedKadaiList = mergeIntoAssignmentList(mergedKadaiList, kadaiMemoList);
  mergedKadaiList = sortAssignmentList(mergedKadaiList);

  createMiniSakaiGeneralized(root, mergedKadaiList, lectureIDs, true, (rendered) => {
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
