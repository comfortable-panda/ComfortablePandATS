import { kadaiDiv, miniPandA } from "./dom";
import { loadFromStorage, saveToStorage } from "./storage";
import { Kadai, KadaiEntry } from "./kadai";
import { convertArrayToKadai, genUniqueStr, mergeIntoKadaiList } from "./utils";
import {displayMiniPandA, lectureIDList, mergedKadaiListNoMemo} from "./content_script";

let toggle = false;

function toggleMiniPandA(): void {
  // miniPandAを表示・非表示にします
  if (toggle) {
    miniPandA.style.width = "0px";
    document.getElementById("cover")?.remove();
  } else {
    miniPandA.style.width = "300px";
    const cover = document.createElement("div");
    cover.id = "cover";
    document.getElementsByTagName("body")[0].appendChild(cover);
    cover.onclick = toggleMiniPandA;
  }
  toggle = !toggle;
}

function toggleKadaiTab(): void {
  // 課題一覧タブの表示・非表示をします
  const kadaiTab = document.querySelector(".kadai-tab");
  // @ts-ignore
  kadaiTab.style.display = "";
  const examTab = document.querySelector(".settings-tab");
  // @ts-ignore
  examTab.style.display = "none";
  const addMemoButton = document.querySelector(".plus-button");
  // @ts-ignore
  addMemoButton.style.display = "";
  const lastKadaiGetTime = document.querySelector(".kadai-time");
  // @ts-ignore
  lastKadaiGetTime.style.display = "";
  const lastQuizGetTime = document.querySelector(".quiz-time");
  // @ts-ignore
  lastQuizGetTime.style.display = "";
}

function toggleSettingsTab(): void {
  // クイズ・小テスト・試験一覧タブを表示・非表示にします
  const kadaiTab = document.querySelector(".kadai-tab");
  // @ts-ignore
  kadaiTab.style.display = "none";
  const settingsTab = document.querySelector(".settings-tab");
  // @ts-ignore
  settingsTab.style.display = "";
  const addMemoButton = document.querySelector(".plus-button");
  // @ts-ignore
  addMemoButton.style.display = "none";
  const lastKadaiGetTime = document.querySelector(".kadai-time");
  // @ts-ignore
  lastKadaiGetTime.style.display = "none";
  const lastQuizGetTime = document.querySelector(".quiz-time");
  // @ts-ignore
  lastQuizGetTime.style.display = "none";
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

async function toggleKadaiFinishedFlag(event: any): Promise<void> {
  const kadaiID = event.target.id;
  let kadaiList: Array<Kadai>;
  if (kadaiID[0] === "m") kadaiList = convertArrayToKadai(await loadFromStorage("TSkadaiMemoList"));
  else if (kadaiID[0] === "q") kadaiList = convertArrayToKadai(await loadFromStorage("TSQuizList"));
  else kadaiList = convertArrayToKadai(await loadFromStorage("TSkadaiList"));

  const updatedKadaiList = [];
  for (const kadai of kadaiList) {
    const updatedKadaiEntries = [];
    for (const kadaiEntry of kadai.kadaiEntries) {
      if (kadaiEntry.kadaiID === kadaiID) {
        const isFinished = kadaiEntry.isFinished;
        let isQuiz = false;
        if (typeof kadaiEntry.isQuiz !== 'undefined') isQuiz = kadaiEntry.isQuiz;
        updatedKadaiEntries.push(
          new KadaiEntry(
            kadaiEntry.kadaiID,
            kadaiEntry.assignmentTitle,
            kadaiEntry.dueDateTimestamp,
            kadaiEntry.isMemo,
            !isFinished,
            isQuiz,
            kadaiEntry.assignmentDetail
          )
        );
      } else {
        updatedKadaiEntries.push(kadaiEntry);
      }
    }
    updatedKadaiList.push(new Kadai(kadai.lectureID, kadai.lectureName, updatedKadaiEntries, kadai.isRead));
  }


  if (kadaiID[0] === "m") saveToStorage("TSkadaiMemoList", updatedKadaiList);
  else if (kadaiID[0] === "q") saveToStorage("TSQuizList", updatedKadaiList);
  else saveToStorage("TSkadaiList", updatedKadaiList);
}

async function addKadaiMemo(): Promise<void> {
  // @ts-ignore
  const selectedIdx = document.querySelector(".todoLecName").selectedIndex;
  // @ts-ignore
  const todoLecID = document.querySelector(".todoLecName").options[selectedIdx].id;
  // @ts-ignore
  const todoContent = document.querySelector(".todoContent").value;
  // @ts-ignore
  const todoDue = document.querySelector(".todoDue").value;
  const todoTimestamp = new Date(`${todoDue}`).getTime() / 1000;

  let kadaiMemoList = await loadFromStorage("TSkadaiMemoList");
  const kadaiMemoEntry = new KadaiEntry(genUniqueStr(),todoContent, todoTimestamp, true, false, false, "");
  const kadaiMemo = new Kadai(todoLecID, todoLecID, [kadaiMemoEntry], true);

  if (typeof kadaiMemoList !== "undefined" && kadaiMemoList.length > 0){
    kadaiMemoList = convertArrayToKadai(kadaiMemoList);
    const idx = kadaiMemoList.findIndex((oldKadaiMemo: Kadai) => {
      return (oldKadaiMemo.lectureID === todoLecID);
    });
    if (idx !== -1){
      kadaiMemoList[idx].kadaiEntries.push(kadaiMemoEntry);
    } else {
      kadaiMemoList.push(kadaiMemo)
    }
  } else {
    kadaiMemoList = [kadaiMemo];
  }
  saveToStorage("TSkadaiMemoList", kadaiMemoList);

  while (miniPandA.firstChild) {
    miniPandA.removeChild(miniPandA.firstChild);
  }
  while (kadaiDiv.firstChild) {
    kadaiDiv.removeChild(kadaiDiv.firstChild);
  }
  miniPandA.remove();
  kadaiDiv.remove();
  const kadaiList = mergeIntoKadaiList(mergedKadaiListNoMemo, kadaiMemoList);
  const quizList = await loadFromStorage("TSQuizList");
  await displayMiniPandA(mergeIntoKadaiList(kadaiList, quizList), lectureIDList);
}

async function deleteKadaiMemo(event: any): Promise<void> {
  const kadaiID = event.target.id;
  const kadaiMemoList = convertArrayToKadai(await loadFromStorage("TSkadaiMemoList"));
  const deletedKadaiMemoList = [];
  for (const kadaiMemo of kadaiMemoList) {
    const kadaiMemoEntries = [];
    for (const _kadaiMemoEntry of kadaiMemo.kadaiEntries) {
      if (_kadaiMemoEntry.kadaiID !== kadaiID) kadaiMemoEntries.push(_kadaiMemoEntry);
    }
    deletedKadaiMemoList.push(new Kadai(kadaiMemo.lectureID, kadaiMemo.lectureName, kadaiMemoEntries, kadaiMemo.isRead));
  }
  while (miniPandA.firstChild) {
    miniPandA.removeChild(miniPandA.firstChild);
  }
  while (kadaiDiv.firstChild) {
    kadaiDiv.removeChild(kadaiDiv.firstChild);
  }
  miniPandA.remove();
  kadaiDiv.remove();

  saveToStorage("TSkadaiMemoList", deletedKadaiMemoList);
  const kadaiList = mergeIntoKadaiList(mergedKadaiListNoMemo, deletedKadaiMemoList);
  const quizList = await loadFromStorage("TSQuizList");
  await displayMiniPandA(mergeIntoKadaiList(kadaiList, quizList), lectureIDList);
}

async function editFavTabMessage(): Promise<void>{
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

export {
  toggleMiniPandA,
  toggleKadaiTab,
  toggleSettingsTab,
  toggleMemoBox,
  toggleKadaiFinishedFlag,
  addKadaiMemo,
  deleteKadaiMemo,
  editFavTabMessage,
};
