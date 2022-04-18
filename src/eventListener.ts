import { assignmentDiv, miniSakai } from "./dom";
import { loadFromLocalStorage, saveToLocalStorage } from "./storage";
import { CourseSiteInfo, Assignment, AssignmentEntry } from "./model";
import { convertArrayToAssignment, genUniqueID, mergeIntoAssignmentList } from "./utils";
import { courseIDList, loadAndMergeAssignmentList, mergedAssignmentListNoMemo } from "./content_script";
import { DefaultSettings, loadConfigs } from "./settings";
import { createFavoritesBarNotification, deleteFavoritesBarNotification, displayMiniSakai } from "./minisakai";

let toggle = false;

/**
 * Change visibility of miniSakai
 */
function toggleMiniSakai(): void {
  if (toggle) {
    // Hide miniSakai
    miniSakai.classList.remove("cs-show");
    miniSakai.classList.add("cs-hide");
    document.getElementById("cs-cover")?.remove();
  } else {
    // Display miniSakai
    miniSakai.classList.remove("cs-hide");
    miniSakai.classList.add("cs-show");
    const cover = document.createElement("div");
    cover.id = "cs-cover";
    document.getElementsByTagName("body")[0].appendChild(cover);
    cover.onclick = toggleMiniSakai;
  }
  toggle = !toggle;
}

/**
 * Change visibility of Assignment tab
 */
function toggleAssignmentTab(): void {
  const assignmentTab = document.querySelector(".cs-assignment-tab") as HTMLElement;
  assignmentTab.style.display = "";
  const settingsTab = document.querySelector(".cs-settings-tab") as HTMLElement;
  settingsTab.style.display = "none";
  const addMemoButton = document.querySelector("#cs-add-memo-btn") as HTMLButtonElement;
  addMemoButton.style.display = "";
  const assignmentFetchedTime = document.querySelector(".cs-assignment-time") as HTMLElement;
  assignmentFetchedTime.style.display = "";
  const quizFetchedTime = document.querySelector(".cs-quiz-time") as HTMLElement;
  quizFetchedTime.style.display = "";
}

/**
 * Change visibility of Settings tab
 */
function toggleSettingsTab(): void {
  const assignmentTab = document.querySelector(".cs-assignment-tab") as HTMLElement;
  assignmentTab.style.display = "none";
  const settingsTab = document.querySelector(".cs-settings-tab") as HTMLElement;
  settingsTab.style.display = "";
  const addMemoButton = document.querySelector("#cs-add-memo-btn") as HTMLButtonElement;
  addMemoButton.style.display = "none";
  const assignmentFetchedTime = document.querySelector(".cs-assignment-time") as HTMLElement;
  assignmentFetchedTime.style.display = "none";
  const quizFetchedTime = document.querySelector(".cs-quiz-time") as HTMLElement;
  quizFetchedTime.style.display = "none";
}

/**
 * Change visibility of Memo box
 */
function toggleMemoBox(): void {
  const addMemoBox = document.querySelector(".addMemoBox") as HTMLElement;
  const toggleStatus = addMemoBox.style.display;
  if (toggleStatus === "") {
    addMemoBox.style.display = "none";
  } else {
    addMemoBox.style.display = "";
  }
}

/**
 * Toggle finished checkbox for assignment/quiz
 */
async function toggleFinishedFlag(event: any): Promise<void> {
  const assignmentID = event.target.id;
  let assignmentList: Array<Assignment>;
  // AssignmentID prefix:
  // "q" -> Quiz
  // "m" -> Memo
  if (assignmentID[0] === "m") assignmentList = convertArrayToAssignment(await loadFromLocalStorage("CS_MemoList"));
  else if (assignmentID[0] === "q") assignmentList = convertArrayToAssignment(await loadFromLocalStorage("CS_QuizList"));
  else assignmentList = convertArrayToAssignment(await loadFromLocalStorage("CS_AssignmentList"));

  const updatedAssignmentList = [];
  for (const assignment of assignmentList) {
    const updatedAssignmentEntries = [];
    for (const assignmentEntry of assignment.assignmentEntries) {
      if (assignmentEntry.assignmentID === assignmentID) {
        const isFinished = assignmentEntry.isFinished;
        let isQuiz = false;
        if (typeof assignmentEntry.isQuiz !== "undefined") isQuiz = assignmentEntry.isQuiz;
        updatedAssignmentEntries.push(
          new AssignmentEntry(
            assignmentEntry.assignmentID,
            assignmentEntry.assignmentTitle,
            assignmentEntry.dueDateTimestamp,
            assignmentEntry.closeDateTimestamp,
            assignmentEntry.isMemo,
            !isFinished,
            isQuiz,
            assignmentEntry.assignmentDetail
          )
        );
      } else {
        updatedAssignmentEntries.push(assignmentEntry);
      }
    }
    updatedAssignmentList.push(new Assignment(assignment.courseSiteInfo, updatedAssignmentEntries, assignment.isRead));
  }

  // Save to local storage
  if (assignmentID[0] === "m") await saveToLocalStorage("CS_MemoList", updatedAssignmentList);
  else if (assignmentID[0] === "q") await saveToLocalStorage("CS_QuizList", updatedAssignmentList);
  else await saveToLocalStorage("CS_AssignmentList", updatedAssignmentList);

  await redrawFavoritesBar(courseIDList, true);
}

/**
 * Update Settings parameter
 */
async function updateSettings(event: any, type: string): Promise<void> {
  const settingsID = event.target.id;
  let settingsValue = event.target.value;
  const config = await loadConfigs();
  const CSsettings = config.CSsettings;

  // Type of Settings
  switch (type) {
    case "check":
      settingsValue = event.target.checked;
      break;
    case "number":
      settingsValue = parseInt(event.target.value);
      break;
    case "string":
      break;
  }

  if (type === "reset") {
    const colorList = [
      "topColorDanger", "topColorWarning" ,"topColorSuccess",
      "miniColorDanger", "miniColorWarning" ,"miniColorSuccess"
    ];
    for (const k of colorList) {
      // @ts-ignore
      CSsettings[k] = DefaultSettings[k];
      const q = <HTMLInputElement>document.getElementById(k);
      if (q) {
        // @ts-ignore
        q.value = DefaultSettings[k];
      }
    }
  } else {
    // @ts-ignore
    CSsettings[settingsID] = settingsValue;
  }

  await saveToLocalStorage("CS_Settings", CSsettings);

  await redrawFavoritesBar(courseIDList, true);
}

/**
 * Add Memo to miniSakai and save.
 */
async function addMemo(): Promise<void> {
  const selectedIdx = (document.querySelector(".todoLecName") as HTMLSelectElement).selectedIndex;
  const courseID = (document.querySelector(".todoLecName") as HTMLSelectElement).options[selectedIdx].id;
  const memoTitle = (document.querySelector(".todoContent") as HTMLInputElement).value;

  // @ts-ignore
  const memoDueDateTimestamp = new Date(document.querySelector(".todoDue").value).getTime() / 1000;

  let memoList = await loadFromLocalStorage("CS_MemoList");
  const memoEntry = new AssignmentEntry(genUniqueID("m"), memoTitle, memoDueDateTimestamp, memoDueDateTimestamp, true, false, false, "");
  const memo = new Assignment(new CourseSiteInfo(courseID, courseID), [memoEntry], true);

  if (typeof memoList !== "undefined" && memoList.length > 0) {
    memoList = convertArrayToAssignment(memoList);
    const idx = memoList.findIndex((oldMemo: Assignment) => {
      return oldMemo.courseSiteInfo.courseID === courseID;
    });
    if (idx !== -1) {
      memoList[idx].assignmentEntries.push(memoEntry);
    } else {
      memoList.push(memo);
    }
  } else {
    memoList = [memo];
  }
  saveToLocalStorage("CS_MemoList", memoList);

  const assignmentList = mergeIntoAssignmentList(mergedAssignmentListNoMemo, memoList);
  const quizList = await loadFromLocalStorage("CS_QuizList");
  redrawMiniSakai();
  await displayMiniSakai(mergeIntoAssignmentList(assignmentList, quizList), courseIDList);

  await redrawFavoritesBar(courseIDList, true);
}

/**
 * Delete Memo from miniSakai and storage.
 */
async function deleteMemo(event: any): Promise<void> {
  const memoID = event.target.id;
  const memoList = convertArrayToAssignment(await loadFromLocalStorage("CS_MemoList"));
  const deletedMemoList = [];
  for (const memo of memoList) {
    const memoEntries = [];
    for (const memoEntry of memo.assignmentEntries) {
      if (memoEntry.assignmentID !== memoID) memoEntries.push(memoEntry);
    }
    deletedMemoList.push(new Assignment(memo.courseSiteInfo, memoEntries, memo.isRead));
  }

  saveToLocalStorage("CS_MemoList", deletedMemoList);
  const assignmentList = mergeIntoAssignmentList(mergedAssignmentListNoMemo, deletedMemoList);
  const quizList = await loadFromLocalStorage("CS_QuizList");
  redrawMiniSakai();
  await displayMiniSakai(mergeIntoAssignmentList(assignmentList, quizList), courseIDList);

  await redrawFavoritesBar(courseIDList, true);
}

/**
 * Edit default message of favorites tab.
 */
async function editFavoritesMessage(): Promise<void> {
  // Wait 200ms until jQuery finished generating message.
  await new Promise((r) => setTimeout(r, 200));
  try {
    const message = document.getElementsByClassName("favorites-max-marker")[0];
    message.innerHTML = `<i class="fa fa-bell warning-icon"></i>${
      chrome.runtime.getManifest().name
    }によってお気に入り登録した<br>サイトが全てバーに追加されました。`;
    const lectureTabs = document.getElementsByClassName("fav-sites-entry");
    const lectureTabsCount = lectureTabs.length;
    for (let i = 0; i < lectureTabsCount; i++) {
      lectureTabs[i].classList.remove("site-favorite-is-past-max");
    }
  } catch (e) {
    console.log("could not edit message");
  }
}

/**
 * Redraw favorites bar
 * @param {CourseSiteInfo[]} courseIDList
 * @param {boolean} useCache
 */
async function redrawFavoritesBar(courseIDList: Array<CourseSiteInfo>, useCache: boolean): Promise<void> {
  deleteFavoritesBarNotification();
  const config = await loadConfigs();
  const newAssignmentList = await loadAndMergeAssignmentList(config, courseIDList, useCache, useCache);
  await createFavoritesBarNotification(courseIDList, newAssignmentList);
}

/**
 * Redraw miniSakai
 */
function redrawMiniSakai() {
  while (miniSakai.firstChild) {
    miniSakai.removeChild(miniSakai.firstChild);
  }
  while (assignmentDiv.firstChild) {
    assignmentDiv.removeChild(assignmentDiv.firstChild);
  }
  miniSakai.remove();
  assignmentDiv.remove();
}

export {
  toggleMiniSakai,
  toggleAssignmentTab,
  toggleSettingsTab,
  toggleMemoBox,
  toggleFinishedFlag,
  addMemo,
  updateSettings,
  deleteMemo,
  editFavoritesMessage,
};
