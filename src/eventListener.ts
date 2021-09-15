import { kadaiDiv, miniPandA } from "./dom";
import { loadFromLocalStorage, saveToLocalStorage } from "./storage";
import { Kadai, KadaiEntry } from "./kadai";
import { convertArrayToKadai, genUniqueStr, mergeIntoKadaiList } from "./utils";
import {
  CPsettings,
  courseIDList,
  loadAndMergeKadaiList,
  mergedKadaiListNoMemo,
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
    document.getElementById("cover")?.remove();
  } else {
    miniPandA.style.width = "300px";
    const cover = document.createElement("div");
    cover.id = "cover";
    document.getElementsByTagName("body")[0].appendChild(cover);
    cover.onclick = toggleMiniSakai;
  }
  toggle = !toggle;
}

function toggleKadaiTab(): void {
  // 課題一覧タブの表示・非表示をします
  const kadaiTab = document.querySelector(".kadai-tab");
  // @ts-ignore
  kadaiTab.style.display = "";
  const settingsTab = document.querySelector(".settings-tab");
  // @ts-ignore
  settingsTab.style.display = "none";
  const addMemoButton = document.querySelector("#plus-button");
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
  const addMemoButton = document.querySelector("#plus-button");
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
  // "m"から始まるものはメモ，"q"から始まるものはクイズを表してる
  if (kadaiID[0] === "m") kadaiList = convertArrayToKadai(await loadFromLocalStorage("TSkadaiMemoList"));
  else if (kadaiID[0] === "q") kadaiList = convertArrayToKadai(await loadFromLocalStorage("TSQuizList"));
  else kadaiList = convertArrayToKadai(await loadFromLocalStorage("TSkadaiList"));

  const updatedKadaiList = [];
  for (const kadai of kadaiList) {
    const updatedKadaiEntries = [];
    for (const kadaiEntry of kadai.kadaiEntries) {
      if (kadaiEntry.kadaiID === kadaiID) {
        const isFinished = kadaiEntry.isFinished;
        let isQuiz = false;
        if (typeof kadaiEntry.isQuiz !== "undefined") isQuiz = kadaiEntry.isQuiz;
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
  if (kadaiID[0] === "m") saveToLocalStorage("TSkadaiMemoList", updatedKadaiList);
  else if (kadaiID[0] === "q") saveToLocalStorage("TSQuizList", updatedKadaiList);
  else saveToLocalStorage("TSkadaiList", updatedKadaiList);

  // NavBarを再描画
  deleteNavBarNotification();
  const newKadaiList = await loadAndMergeKadaiList(courseIDList, true, true);
  createNavBarNotification(courseIDList, newKadaiList);
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
  deleteNavBarNotification();
  const newKadaiList = await loadAndMergeKadaiList(courseIDList, false, false);
  createNavBarNotification(courseIDList, newKadaiList);
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

  let kadaiMemoList = await loadFromLocalStorage("TSkadaiMemoList");
  const kadaiMemoEntry = new KadaiEntry(genUniqueStr(), todoContent, todoTimestamp, true, false, false, "");
  const kadaiMemo = new Kadai(todoLecID, todoLecID, [kadaiMemoEntry], true);

  if (typeof kadaiMemoList !== "undefined" && kadaiMemoList.length > 0) {
    kadaiMemoList = convertArrayToKadai(kadaiMemoList);
    const idx = kadaiMemoList.findIndex((oldKadaiMemo: Kadai) => {
      return (oldKadaiMemo.lectureID === todoLecID);
    });
    if (idx !== -1) {
      kadaiMemoList[idx].kadaiEntries.push(kadaiMemoEntry);
    } else {
      kadaiMemoList.push(kadaiMemo);
    }
  } else {
    kadaiMemoList = [kadaiMemo];
  }
  saveToLocalStorage("TSkadaiMemoList", kadaiMemoList);

  // miniPandAを再描画
  while (miniPandA.firstChild) {
    miniPandA.removeChild(miniPandA.firstChild);
  }
  while (kadaiDiv.firstChild) {
    kadaiDiv.removeChild(kadaiDiv.firstChild);
  }
  miniPandA.remove();
  kadaiDiv.remove();
  const kadaiList = mergeIntoKadaiList(mergedKadaiListNoMemo, kadaiMemoList);
  const quizList = await loadFromLocalStorage("TSQuizList");
  await displayMiniPandA(mergeIntoKadaiList(kadaiList, quizList), courseIDList);

  // NavBarを再描画
  deleteNavBarNotification();
  const newKadaiList = await loadAndMergeKadaiList(courseIDList, false, false);
  createNavBarNotification(courseIDList, newKadaiList);
}

async function deleteKadaiMemo(event: any): Promise<void> {
  const kadaiID = event.target.id;
  const kadaiMemoList = convertArrayToKadai(await loadFromLocalStorage("TSkadaiMemoList"));
  const deletedKadaiMemoList = [];
  for (const kadaiMemo of kadaiMemoList) {
    const kadaiMemoEntries = [];
    for (const _kadaiMemoEntry of kadaiMemo.kadaiEntries) {
      if (_kadaiMemoEntry.kadaiID !== kadaiID) kadaiMemoEntries.push(_kadaiMemoEntry);
    }
    deletedKadaiMemoList.push(new Kadai(kadaiMemo.lectureID, kadaiMemo.lectureName, kadaiMemoEntries, kadaiMemo.isRead));
  }

  // miniPandAを再描画
  while (miniPandA.firstChild) {
    miniPandA.removeChild(miniPandA.firstChild);
  }
  while (kadaiDiv.firstChild) {
    kadaiDiv.removeChild(kadaiDiv.firstChild);
  }
  miniPandA.remove();
  kadaiDiv.remove();

  saveToLocalStorage("TSkadaiMemoList", deletedKadaiMemoList);
  const kadaiList = mergeIntoKadaiList(mergedKadaiListNoMemo, deletedKadaiMemoList);
  const quizList = await loadFromLocalStorage("TSQuizList");
  await displayMiniPandA(mergeIntoKadaiList(kadaiList, quizList), courseIDList);

  // NavBarを再描画
  deleteNavBarNotification();
  const newKadaiList = await loadAndMergeKadaiList(courseIDList, false, false);
  createNavBarNotification(courseIDList, newKadaiList);
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

export {
  toggleMiniSakai,
  toggleKadaiTab,
  toggleSettingsTab,
  toggleMemoBox,
  toggleKadaiFinishedFlag,
  addKadaiMemo,
  updateSettings,
  deleteKadaiMemo,
  editFavTabMessage,
};
