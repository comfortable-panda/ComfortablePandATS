import { assignmentDiv, miniPandA } from "./dom";
import { loadFromLocalStorage, saveToLocalStorage } from "./storage";
import {CourseSiteInfo, Assignment, AssignmentEntry} from "./model";
import { convertArrayToAssignment, genUniqueStr, mergeIntoAssignmentList } from "./utils";
import {
  CPsettings,
  courseIDList,
  loadAndMergeAssignmentList,
  mergedAssignmentListNoMemo,
} from "./content_script";
import { DefaultSettings, Settings } from "./settings";
import {
  createNavBarNotification,
  deleteNavBarNotification,
  displayMiniPandA,
} from "./minipanda";

let toggle = false;

function toggleMiniSakai(): void {
  // miniSakaiを表示・非表示にします
  if (toggle) {
    miniPandA.style.width = "0px";
    document.getElementById("cs-cover")?.remove();
  } else {
    miniPandA.style.width = "300px";
    const cover = document.createElement("div");
    cover.id = "cs-cover";
    document.getElementsByTagName("body")[0].appendChild(cover);
    cover.onclick = toggleMiniSakai;
  }
  toggle = !toggle;
}

function toggleAssignmentTab(): void {
  // 課題一覧タブの表示・非表示をします
  const assignmentTab = document.querySelector(".cs-assignment-tab");
  // @ts-ignore
  assignmentTab.style.display = "";
  const settingsTab = document.querySelector(".cs-settings-tab");
  // @ts-ignore
  settingsTab.style.display = "none";
  const addMemoButton = document.querySelector("#cs-add-memo-btn");
  // @ts-ignore
  addMemoButton.style.display = "";
  const assignmentFetchedTime = document.querySelector(".cs-assignment-time");
  // @ts-ignore
  assignmentFetchedTime.style.display = "";
  const quizFetchedTime = document.querySelector(".cs-quiz-time");
  // @ts-ignore
  quizFetchedTime.style.display = "";
}

function toggleSettingsTab(): void {
  // クイズ・小テスト・試験一覧タブを表示・非表示にします
  const assignmentTab = document.querySelector(".cs-assignment-tab");
  // @ts-ignore
  assignmentTab.style.display = "none";
  const settingsTab = document.querySelector(".cs-settings-tab");
  // @ts-ignore
  settingsTab.style.display = "";
  const addMemoButton = document.querySelector("#cs-add-memo-btn");
  // @ts-ignore
  addMemoButton.style.display = "none";
  const assignmentFetchedTime = document.querySelector(".cs-assignment-time");
  // @ts-ignore
  assignmentFetchedTime.style.display = "none";
  const quizFetchedTime = document.querySelector(".cs-quiz-time");
  // @ts-ignore
  quizFetchedTime.style.display = "none";
}

function toggleMemoBox(): void {
  // メモ追加のボックスを表示・非表示にします
  const addMemoBox = document.querySelector(".addMemoBox");
  // @ts-ignore
  const toggleStatus = addMemoBox.style.display;
  if (toggleStatus === "") {
    // @ts-ignore
    addMemoBox.style.display = "none";
  } else {
    // @ts-ignore
    addMemoBox.style.display = "";
  }
}

async function toggleFinishedFlag(event: any): Promise<void> {
  const assignmentID = event.target.id;
  let assignmentList: Array<Assignment>;
  // "m"から始まるものはメモ，"q"から始まるものはクイズを表してる
  if (assignmentID[0] === "m") assignmentList = convertArrayToAssignment(await loadFromLocalStorage("TSkadaiMemoList"));
  else if (assignmentID[0] === "q") assignmentList = convertArrayToAssignment(await loadFromLocalStorage("TSQuizList"));
  else assignmentList = convertArrayToAssignment(await loadFromLocalStorage("TSkadaiList"));

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

  if (assignmentID[0] === "m") await saveToLocalStorage("TSkadaiMemoList", updatedAssignmentList);
  else if (assignmentID[0] === "q") await saveToLocalStorage("TSQuizList", updatedAssignmentList);
  else await saveToLocalStorage("TSkadaiList", updatedAssignmentList);

  // NavBarを再描画
  await reloadNavBar(courseIDList, true);
}

async function updateSettings(event: any, type: string): Promise<void> {
  const settingsID = event.target.id;
  let settingsValue = event.currentTarget.value;

  switch (type) {
    case "check":
      settingsValue = event.currentTarget.checked;
      break;
    case "number":
      settingsValue = parseInt(event.currentTarget.value);
      break;
    case "string":
      break;
  }

  const settings = new Settings();
  const oldSettings = await loadFromLocalStorage("TSSettings");
  for (const i in DefaultSettings){
    // @ts-ignore
    settings[i] = oldSettings[i] ?? DefaultSettings[i];
  }

  if (type === "reset") {
    const dict = [
      "topColorDanger", "topColorWarning" ,"topColorSuccess",
      "miniColorDanger", "miniColorWarning" ,"miniColorSuccess"
    ];
    for (const k of dict) {
      // @ts-ignore
      settings[k] = DefaultSettings[k];
      // @ts-ignore
      CPsettings[k] = DefaultSettings[k];
      const q = <HTMLInputElement>document.getElementById(k);
      if (q) {
        // @ts-ignore
        q.value = DefaultSettings[k];
      }
    }
  } else {
    // @ts-ignore
    settings[settingsID] = settingsValue;
    // @ts-ignore
    CPsettings[settingsID] = settingsValue;
  }

  saveToLocalStorage("TSSettings", settings);

  // NavBarを再描画
  await reloadNavBar(courseIDList, true);
}

async function addMemo(): Promise<void> {
  const selectedIdx = (document.querySelector(".todoLecName") as HTMLSelectElement).selectedIndex;
  const courseID = (document.querySelector(".todoLecName") as HTMLSelectElement).options[selectedIdx].id;
  const memoTitle = (document.querySelector(".todoContent") as HTMLInputElement).value;
  // @ts-ignore
  const memoDueDateTimestamp = new Date(document.querySelector(".todoDue").value).getTime() / 1000;

  let memoList = await loadFromLocalStorage("TSkadaiMemoList");
  const memoEntry = new AssignmentEntry(genUniqueStr(), memoTitle, memoDueDateTimestamp, memoDueDateTimestamp, true, false, false, "");
  const memo = new Assignment(new CourseSiteInfo(courseID, courseID), [memoEntry], true);

  if (typeof memoList !== "undefined" && memoList.length > 0) {
    memoList = convertArrayToAssignment(memoList);
    const idx = memoList.findIndex((oldMemo: Assignment) => {
      return (oldMemo.courseSiteInfo.courseID === courseID);
    });
    if (idx !== -1) {
      memoList[idx].assignmentEntries.push(memoEntry);
    } else {
      memoList.push(memo);
    }
  } else {
    memoList = [memo];
  }
  saveToLocalStorage("TSkadaiMemoList", memoList);

  // miniPandAを再描画
  while (miniPandA.firstChild) {
    miniPandA.removeChild(miniPandA.firstChild);
  }
  while (assignmentDiv.firstChild) {
    assignmentDiv.removeChild(assignmentDiv.firstChild);
  }
  miniPandA.remove();
  assignmentDiv.remove();
  const assignmentList = mergeIntoAssignmentList(mergedAssignmentListNoMemo, memoList);
  const quizList = await loadFromLocalStorage("TSQuizList");
  await displayMiniPandA(mergeIntoAssignmentList(assignmentList, quizList), courseIDList);

  // NavBarを再描画
  await reloadNavBar(courseIDList, true);
}

async function deleteMemo(event: any): Promise<void> {
  const memoID = event.target.id;
  const memoList = convertArrayToAssignment(await loadFromLocalStorage("TSkadaiMemoList"));
  const deletedMemoList = [];
  for (const memo of memoList) {
    const memoEntries = [];
    for (const memoEntry of memo.assignmentEntries) {
      if (memoEntry.assignmentID !== memoID) memoEntries.push(memoEntry);
    }
    deletedMemoList.push(new Assignment(memo.courseSiteInfo, memoEntries, memo.isRead));
  }

  // miniPandAを再描画
  while (miniPandA.firstChild) {
    miniPandA.removeChild(miniPandA.firstChild);
  }
  while (assignmentDiv.firstChild) {
    assignmentDiv.removeChild(assignmentDiv.firstChild);
  }
  miniPandA.remove();
  assignmentDiv.remove();

  saveToLocalStorage("TSkadaiMemoList", deletedMemoList);
  const assignmentList = mergeIntoAssignmentList(mergedAssignmentListNoMemo, deletedMemoList);
  const quizList = await loadFromLocalStorage("TSQuizList");
  await displayMiniPandA(mergeIntoAssignmentList(assignmentList, quizList), courseIDList);

  // NavBarを再描画
  await reloadNavBar(courseIDList, true);
}

async function editFavTabMessage(): Promise<void> {
  // 200ms待ってからgetElementしないと，jQueryで生成される前に参照してしまう
  await new Promise((r) => setTimeout(r, 200));
  try {
    const message = document.getElementsByClassName("favorites-max-marker")[0];
    message.innerHTML =
      '<i class="fa fa-bell warning-icon"></i>ComfortablePandAによってお気に入り登録した<br>サイトが全てバーに追加されました。';
    const lectureTabs = document.getElementsByClassName("fav-sites-entry");
    const lectureTabsCount = lectureTabs.length;
    for (let i = 0; i < lectureTabsCount; i++) {
      lectureTabs[i].classList.remove("site-favorite-is-past-max");
    }
  } catch (e) {
    console.log("could not edit message");
  }
}

async function reloadNavBar(courseIDList: Array<CourseSiteInfo>, useCache: boolean): Promise<void>{
  // NavBarを再描画
  deleteNavBarNotification();
  const newAssignmentList = await loadAndMergeAssignmentList(courseIDList, useCache, useCache);
  createNavBarNotification(courseIDList, newAssignmentList);
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
  editFavTabMessage,
};
