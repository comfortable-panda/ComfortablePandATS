import { kadaiDiv, miniPandA } from "./dom";
import { loadFromStorage, saveToStorage } from "./storage";
import { Kadai, KadaiEntry } from "./kadai";
import { convertArrayToKadai, genUniqueStr, mergeMemoIntoKadaiList } from "./utils";
import {displayMiniPandA, fetchedTime, lectureIDList, mergedKadaiList, mergedKadaiListNoMemo} from "./content_script";

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
  const examTab = document.querySelector(".exam-tab");
  // @ts-ignore
  examTab.style.display = "none";
  const addMemoButton = document.querySelector(".plus-button");
  // @ts-ignore
  addMemoButton.style.display = "";
  const lastKadaiGetTime = document.querySelector(".kadai-time");
  // @ts-ignore
  lastKadaiGetTime.style.display = "";
}

function toggleExamTab(): void {
  // クイズ・小テスト・試験一覧タブを表示・非表示にします
  const kadaiTab = document.querySelector(".kadai-tab");
  // @ts-ignore
  kadaiTab.style.display = "none";
  const examTab = document.querySelector(".exam-tab");
  // @ts-ignore
  examTab.style.display = "";
  const addMemoButton = document.querySelector(".plus-button");
  // @ts-ignore
  addMemoButton.style.display = "none";
  const lastKadaiGetTime = document.querySelector(".kadai-time");
  // @ts-ignore
  lastKadaiGetTime.style.display = "none";
  // loadExamfromStorage();
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
  if (kadaiID[0] === "m") kadaiList = convertArrayToKadai(await loadFromStorage("kadaiMemoList"));
  else kadaiList = convertArrayToKadai(await loadFromStorage("kadaiList"));

  const updatedKadaiList = [];
  for (const kadai of kadaiList) {
    const updatedKadaiEntries = [];
    for (const kadaiEntry of kadai.kadaiEntries) {
      if (kadaiEntry.kadaiID === kadaiID) {
        const isFinished = kadaiEntry.isFinished;
        updatedKadaiEntries.push(
          new KadaiEntry(
            kadaiEntry.kadaiID,
            kadaiEntry.assignmentTitle,
            kadaiEntry.dueDateTimestamp,
            kadaiEntry.isMemo,
            !isFinished,
            kadaiEntry.assignmentDetail
          )
        );
      } else {
        updatedKadaiEntries.push(kadaiEntry);
      }
    }
    updatedKadaiList.push(new Kadai(kadai.lectureID, kadai.lectureName, updatedKadaiEntries, kadai.isRead));
  }
  console.log("見つけた", updatedKadaiList);
  if (kadaiID[0] === "m") saveToStorage("kadaiMemoList", updatedKadaiList);
  else saveToStorage("kadaiList", updatedKadaiList);
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

  let kadaiMemoList = await loadFromStorage("kadaiMemoList");
  const kadaiMemoEntry = new KadaiEntry(genUniqueStr(),todoContent, todoTimestamp, true, false, "");
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
  saveToStorage("kadaiMemoList", kadaiMemoList);
  console.log("メモ保存した", kadaiMemoList);
  while (miniPandA.firstChild) {
    miniPandA.removeChild(miniPandA.firstChild);
  }
  while (kadaiDiv.firstChild) {
    kadaiDiv.removeChild(kadaiDiv.firstChild);
  }
  miniPandA.remove();
  kadaiDiv.remove();
  await displayMiniPandA(mergeMemoIntoKadaiList(mergedKadaiListNoMemo, kadaiMemoList), lectureIDList, fetchedTime);
}

async function deleteKadaiMemo(event: any) {
  const kadaiID = event.target.id;
  const kadaiMemoList = convertArrayToKadai(await loadFromStorage("kadaiMemoList"));
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

  console.log("deleted memo", deletedKadaiMemoList);
  console.log("origial memo", mergedKadaiListNoMemo);
  console.log("merged memo", mergeMemoIntoKadaiList(mergedKadaiListNoMemo, deletedKadaiMemoList));
  saveToStorage("kadaiMemoList", deletedKadaiMemoList);
  await displayMiniPandA(mergeMemoIntoKadaiList(mergedKadaiListNoMemo, deletedKadaiMemoList), lectureIDList, fetchedTime);
}

export {
  toggleMiniPandA,
  toggleKadaiTab,
  toggleExamTab,
  toggleMemoBox,
  toggleKadaiFinishedFlag,
  addKadaiMemo,
  deleteKadaiMemo,
};
