import { Kadai, LectureInfo } from "./kadai";
import {
  createLectureIDMap,
  formatTimestamp,
  getDaysUntil,
  getTimeRemain,
  nowTime
} from "./utils";
import {
  addAttributes,
  appendChildAll,
  cloneElem,
  createElem,
  DueGroupDom,
  hamburger,
  kadaiDiv,
  KadaiEntryDom,
  miniPandA,
  settingsDiv,
  SettingsDom
} from "./dom";
import {
  addKadaiMemo,
  deleteKadaiMemo,
  toggleKadaiFinishedFlag,
  toggleKadaiTab,
  toggleMemoBox,
  toggleMiniPandA,
  toggleSettingsTab,
  updateSettings,
} from "./eventListener";
import {
  CPsettings,
  kadaiCacheInterval,
  kadaiFetchedTime,
  quizCacheInterval,
  quizFetchedTime,
  VERSION,
} from "./content_script";

function createHanburgerButton(): void {
  const topbar = document.getElementById("mastLogin");
  try {
    topbar?.appendChild(hamburger);
  } catch (e) {
    console.log("could not launch miniPandA.");
  }
}

function createMiniPandA(): void {
  const miniPandALogo = createElem("img", {
    className: "logo",
    alt: "logo",
    src: chrome.extension.getURL("img/logo.png"),
  });
  const version = createElem("p", {　classList: "cp-version", innerText: `Version ${VERSION}`});

  const miniPandACloseBtn = createElem("a", { href: "#", id: "close_btn", textContent: "×" });
  miniPandACloseBtn.classList.add("closebtn", "q");
  miniPandACloseBtn.addEventListener("click", toggleMiniPandA);

  const kadaiTab = createElem("input", { type: "radio", id: "kadaiTab", name: "cp_tab", checked: true }, {"click": toggleKadaiTab});
  const kadaiTabLabel = createElem("label", { htmlFor: "kadaiTab", innerText: "　課題一覧　" });
  const settingsTab = createElem("input", { type: "radio", id: "settingsTab", name: "cp_tab", checked: false }, {"click": toggleSettingsTab});
  const settingsTabLabel = createElem("label", { htmlFor: "settingsTab", innerText: "　詳細設定　" });
  const addMemoButton = createElem("button", { className: "plus-button", innerText: "+" },{"click": toggleMemoBox});

  const kadaiFetchedTimestamp = new Date( (typeof kadaiFetchedTime === "number")? kadaiFetchedTime : nowTime);
  const kadaiFetchedTimeString = createElem("p", { className: "kadai-time" });
  kadaiFetchedTimeString.innerText = "課題取得日時： " + kadaiFetchedTimestamp.toLocaleDateString() + " " + kadaiFetchedTimestamp.getHours() + ":" + ("00" + kadaiFetchedTimestamp.getMinutes()).slice(-2) + ":" + ("00" + kadaiFetchedTimestamp.getSeconds()).slice(-2);
  const quizFetchedTimestamp = new Date((typeof quizFetchedTime === "number")? quizFetchedTime : nowTime);
  const quizFetchedTimeString = createElem("p", { className: "quiz-time" });
  quizFetchedTimeString.innerText = "クイズ取得日時： " + quizFetchedTimestamp.toLocaleDateString() + " " + quizFetchedTimestamp.getHours() + ":" + ("00" + quizFetchedTimestamp.getMinutes()).slice(-2) + ":" + ("00" + quizFetchedTimestamp.getSeconds()).slice(-2);
  appendChildAll(miniPandA, [
    miniPandALogo,
    version,
    miniPandACloseBtn,
    kadaiTab,
    kadaiTabLabel,
    settingsTab,
    settingsTabLabel,
    addMemoButton,
    kadaiFetchedTimeString,
    quizFetchedTimeString,
  ]);

  const parent = document.getElementById("pageBody");
  const ref = document.getElementById("toolMenuWrap");

  parent?.insertBefore(miniPandA, ref);
}

function appendMemoBox(lectureIDList: Array<LectureInfo>): void {
  const memoEditBox = createElem("div", {className: "settingsBox addMemoBox", style: "none"});
  const memoLabel = createElem("label", {style: "block"});
  const todoLecLabel = cloneElem(memoLabel, {innerText: "講義名"});
  const todoLecSelect = createElem("select", { className: "todoLecName" });
  const todoLecOption = createElem("option");

  for (const lecture of lectureIDList) {
    const c_todoLecOption = cloneElem(todoLecOption, {text: lecture.lectureName, id: lecture.lectureID});
    todoLecSelect.appendChild(c_todoLecOption);
  }

  todoLecLabel.appendChild(todoLecSelect);

  const todoContentLabel = cloneElem(memoLabel, { innerText: "メモ" });
  const todoContentInput = createElem("input", { type: "text", className: "todoContent" });
  todoContentLabel.appendChild(todoContentInput);

  const todoDueLabel = cloneElem(memoLabel, {innerText: "期限"});
  const todoDueInput = createElem("input", { type: "datetime-local", className: "todoDue" });
  todoDueInput.value = new Date(`${new Date().toISOString().substr(0, 16)}-10:00`).toISOString().substr(0, 16);
  todoDueLabel.appendChild(todoDueInput);

  const todoSubmitButton = createElem("button", { type: "submit", id: "todo-add", innerText: "追加" }, {"click": addKadaiMemo});

  appendChildAll(memoEditBox, [todoLecLabel, todoContentLabel, todoDueLabel, todoSubmitButton]);
  kadaiDiv.appendChild(memoEditBox);
}

async function displayMiniPandA(mergedKadaiList: Array<Kadai>, lectureIDList: Array<LectureInfo>): Promise<void>{
  createMiniPandA();
  appendMemoBox(lectureIDList);
  await createSettingsTab();
  updateMiniPandA(mergedKadaiList, lectureIDList);
}

function createSettingItem(itemDescription: string, value: boolean | number, id: string, display=true) {
  const mainDiv = SettingsDom.mainDiv.cloneNode(true);
  const div = SettingsDom.div.cloneNode(true);
  const label = SettingsDom.label.cloneNode(true);
  const p = SettingsDom.p.cloneNode(true);
  p.innerText = itemDescription;
  if(!display)mainDiv.style.display = "none";
  if (typeof value === "boolean") {
    label.classList.add("switch");
    const toggleBtn = SettingsDom.toggleBtn.cloneNode(true);
    toggleBtn.checked = value;
    toggleBtn.id = id;
    toggleBtn.addEventListener("change", updateSettings, true);
    const span = SettingsDom.span.cloneNode(true);

    appendChildAll(label, [toggleBtn, span]);
  }
  if (typeof value === "number") {
    const inputBox = SettingsDom.inputBox.cloneNode(true);
    inputBox.value = value;
    inputBox.id = id;
    inputBox.addEventListener("change", updateSettings, true);
    appendChildAll(label, [inputBox]);
  }
  appendChildAll(mainDiv, [p, label]);
  settingsDiv.appendChild(mainDiv);
}

async function createSettingsTab(): Promise<void> {
  createSettingItem("完了済の課題も色付けする", CPsettings.displayCheckedKadai ?? true, "displayCheckedKadai");
  createSettingItem("課題キャッシュ時間 [秒]", CPsettings.kadaiCacheInterval ?? kadaiCacheInterval, "kadaiCacheInterval");
  createSettingItem("クイズキャッシュ時間 [秒]", CPsettings.quizCacheInterval ?? quizCacheInterval, "quizCacheInterval");
  createSettingItem("デバッグモード", CPsettings.makePandAGreatAgain ?? false, "makePandAGreatAgain", false);

  settingsDiv.style.display = "none";
}

function updateMiniPandA(kadaiList: Array<Kadai>, lectureIDList: Array<LectureInfo>): void {
  const dueGroupHeaderName = ["締め切り２４時間以内", "締め切り５日以内", "締め切り１４日以内", "その他"];
  const dueGroupColor = ["danger", "warning", "success", "other"];
  const initLetter = ["a", "b", "c", "d"];
  const lectureIDMap = createLectureIDMap(lectureIDList);

  // 0: <24h, 1: <5d, 2: <14d, 3: >14d
  for (let i = 0; i < 4; i++) {
    let entryCount = 0;
    // 色別のグループを作成する
    const dueGroupHeader = cloneElem(DueGroupDom.header, {className: `sidenav-${dueGroupColor[i]}`, style:"none"});
    const dueGroupHeaderTitle = cloneElem(DueGroupDom.headerTitle, {textContent: `${dueGroupHeaderName[i]}`});
    const dueGroupContainer = cloneElem(DueGroupDom.container, {style:"none"});
    dueGroupHeader.appendChild(dueGroupHeaderTitle);
    dueGroupContainer.classList.add(`sidenav-list-${dueGroupColor[i]}`);

    // 各講義についてループ
    for (const item of kadaiList) {
      // 課題アイテムを入れるやつを作成
      const dueGroupBody = cloneElem(DueGroupDom.body, {className: `kadai-${dueGroupColor[i]}`, id:initLetter[i] + item.lectureID});
      const dueGroupLectureName = DueGroupDom.lectureName.cloneNode(true) as HTMLAnchorElement;
      dueGroupLectureName.classList.add(`lecture-${dueGroupColor[i]}`, "lecture-name")
      dueGroupLectureName.textContent = "" + lectureIDMap.get(item.lectureID);
      dueGroupBody.appendChild(dueGroupLectureName);
      const topSite = item.getTopSite();
      if (topSite != null) dueGroupLectureName.href = topSite;

      // 各講義の課題一覧についてループ
      let cnt = 0;
      for (const kadai of item.kadaiEntries) {
        let kadaiCheckbox = cloneElem(KadaiEntryDom.checkbox);
        const kadaiLabel = cloneElem(KadaiEntryDom.label);
        const kadaiDueDate = cloneElem(KadaiEntryDom.dueDate);
        const kadaiRemainTime = cloneElem(KadaiEntryDom.remainTime);
        const kadaiTitle = cloneElem(KadaiEntryDom.title);
        const memoBadge = createElem("span", {classList: "add-badge add-badge-success", innerText: "メモ"});
        const quizBadge = createElem("span", {classList: "add-badge add-badge-quiz", innerText: "クイズ"});
        const deleteBadge = createElem("span", {className: "del-button", id: kadai.kadaiID, innerText:"×"}, {"click": deleteKadaiMemo});

        const dispDue = formatTimestamp(kadai.dueDateTimestamp);
        const timeRemain = getTimeRemain((kadai.dueDateTimestamp * 1000 - nowTime) / 1000);

        const daysUntilDue = getDaysUntil(nowTime, kadai.dueDateTimestamp * 1000);
        if ((daysUntilDue > 0 && daysUntilDue <= 1 && i === 0) || (daysUntilDue > 1 && daysUntilDue <= 5 && i === 1) || (daysUntilDue > 5 && daysUntilDue <= 14 && i === 2) || (daysUntilDue > 14 && i === 3)) {
          kadaiDueDate.textContent = "" + dispDue;
          kadaiRemainTime.textContent = `あと${timeRemain[0]}日${timeRemain[1]}時間${timeRemain[2]}分`;
          kadaiTitle.textContent = "" + kadai.assignmentTitle;
          if (kadai.isFinished) kadaiCheckbox.checked = true;
          kadaiCheckbox = addAttributes(kadaiCheckbox, {id: kadai.kadaiID, lectureID:item.lectureID}, {"change": toggleKadaiFinishedFlag})
          kadaiLabel.htmlFor = kadai.kadaiID;

          const addBadge = function (badge: any, deleteBadge?: any) {
            kadaiTitle.textContent = "";
            kadaiTitle.appendChild(badge);
            kadaiTitle.append(kadai.assignmentTitle);
            if (deleteBadge) kadaiTitle.appendChild(deleteBadge);
          };

          if (kadai.isMemo) addBadge(memoBadge, deleteBadge);
          if (kadai.isQuiz) addBadge(quizBadge);

          appendChildAll(dueGroupBody, [kadaiCheckbox, kadaiLabel, kadaiDueDate, kadaiRemainTime, kadaiTitle]);
          cnt++;
        }
      }
      // 各講義の課題で該当するものがある場合はグループに追加
      if (cnt > 0) {
        dueGroupContainer.appendChild(dueGroupBody);
        entryCount++;
      }
    }
    if (entryCount > 0) {
      dueGroupHeader.style.display = "";
      dueGroupContainer.style.display = "";
    }
    appendChildAll(miniPandA, [kadaiDiv, settingsDiv]);
    appendChildAll(kadaiDiv, [dueGroupHeader, dueGroupContainer]);
  }

  // 何もない時はRelaxPandAを表示する
  if (kadaiList.length === 0) {
    const kadaiTab = kadaiDiv;
    const relaxDiv = createElem("div", { className: "relaxpanda" });
    const relaxPandaP = createElem("p", { className: "relaxpanda-p", innerText: "現在表示できる課題はありません" });
    const relaxPandaImg = createElem("img", { className: "relaxpanda-img", alt: "logo", src: chrome.extension.getURL("img/relaxPanda.png")});
    appendChildAll(relaxDiv, [relaxPandaP, relaxPandaImg]);
    kadaiTab.appendChild(relaxDiv);
  }
}

function deleteNavBarNotification(): void {
  const classlist = ["red-badge", "nav-danger", "nav-warning", "nav-safe"];
  for (const c of classlist){
    const q = document.querySelectorAll(`.${c}`);
    // @ts-ignore
    for (const _ of q) {
      _.classList.remove(`${c}`);
      _.style = "";
    }
  }
}

function createNavBarNotification(lectureIDList: Array<LectureInfo>, kadaiList: Array<Kadai>): void {
  const defaultTab = document.querySelectorAll(".Mrphs-sitesNav__menuitem");
  const defaultTabCount = Object.keys(defaultTab).length;

  for (const lecture of lectureIDList) {
    for (let j = 3; j < defaultTabCount; j++) {
      // @ts-ignore
      const lectureID = defaultTab[j].getElementsByClassName("link-container")[0].href.match("(https?://[^/]+)/portal/site-reset/([^/]+)")[2];

      const q = kadaiList.findIndex((kadai) => {
        return kadai.lectureID === lectureID;
      });
      if (q !== -1) {
        const closestTime = (CPsettings.displayCheckedKadai) ? kadaiList[q].closestDueDateTimestamp : kadaiList[q].closestDueDateTimestampExcludeFinished;
        if (!kadaiList[q].isRead && closestTime !== -1) {
          defaultTab[j].classList.add("red-badge");
        }
        const daysUntilDue = getDaysUntil(nowTime, closestTime * 1000);
        const aTagCount = defaultTab[j].getElementsByTagName("a").length;

        if (daysUntilDue > 0 && daysUntilDue <= 1) {
          defaultTab[j].classList.add("nav-danger");
          for (let i = 0; i < aTagCount; i++) {
            defaultTab[j].getElementsByTagName("a")[i].classList.add("nav-danger");
          }
        } else if (daysUntilDue > 1 && daysUntilDue <= 5) {
          defaultTab[j].classList.add("nav-warning");
          for (let i = 0; i < aTagCount; i++) {
            defaultTab[j].getElementsByTagName("a")[i].classList.add("nav-warning");
          }
        } else if (daysUntilDue > 5 && daysUntilDue <= 14) {
          defaultTab[j].classList.add("nav-safe");
          for (let i = 0; i < aTagCount; i++) {
            defaultTab[j].getElementsByTagName("a")[i].classList.add("nav-safe");
          }
        }
      }
    }
  }
}

export {
  createHanburgerButton,
  createMiniPandA,
  appendMemoBox,
  createSettingsTab,
  updateMiniPandA,
  displayMiniPandA,
  deleteNavBarNotification,
  createNavBarNotification,
};
