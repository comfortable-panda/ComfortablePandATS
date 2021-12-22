import { Assignment, CourseSiteInfo } from "./model";
import { loadFromLocalStorage } from "./storage";
import { convertArrayToAssignment, mergeIntoAssignmentList, sortAssignmentList } from "./utils";
import { createMiniSakaiGeneralized } from "./minisakai";

const subSakaiRoot = document.querySelector("#sub-sakai");

async function updateSubSakai(root: Element) {
  let mergedAssignmentList: Array<Assignment>;

  const assignmentList = (await loadFromLocalStorage("TSkadaiList")) as Array<Assignment>;
  const quizList = (await loadFromLocalStorage("TSQuizList")) as Array<Assignment>;
  const assignmentMemoList = convertArrayToAssignment(await loadFromLocalStorage("TSkadaiMemoList"));
  const courseIDs = (await loadFromLocalStorage("TSlectureids")) as Array<CourseSiteInfo>;
  mergedAssignmentList = mergeIntoAssignmentList(assignmentList, quizList);
  mergedAssignmentList = mergeIntoAssignmentList(mergedAssignmentList, assignmentMemoList);
  mergedAssignmentList = sortAssignmentList(mergedAssignmentList);

  createMiniSakaiGeneralized(root, mergedAssignmentList, courseIDs, true, (rendered) => {
    console.log(rendered);
    root.innerHTML = rendered;
  });
}

function addSubSakaiToPopup(): Element | null {
  if (subSakaiRoot == null) return null;
  console.log(subSakaiRoot);
  return subSakaiRoot;
}

function initSubSakai() {
  const root = addSubSakaiToPopup();
  root && updateSubSakai(root);
}

initSubSakai();
