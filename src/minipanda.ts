import { Kadai, LectureInfo } from "./kadai";
import {
  createLectureIDMap,
  formatTimestamp,
  getDaysUntil,
  getTimeRemain,
  nowTime,
} from "./utils";
import {
  appendChildAll,
  cloneElem,
  hamburger,
  miniPandA,
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
// @ts-ignore// @ts-ignore
import Mustache = require("mustache");

function createHanburgerButton(): void {
  const topbar = document.getElementById("mastLogin");
  try {
    topbar?.appendChild(hamburger);
  } catch (e) {
    console.log("could not launch miniPandA.");
  }
}

export function createMiniPandAGeneralized(root: Element, kadaiList: Array<Kadai>, lectureIDList: Array<LectureInfo>, subset: boolean, insertionProcess: (rendered: string) => void): void {
  const kadaiFetchedTimestamp = new Date( (typeof kadaiFetchedTime === "number")? kadaiFetchedTime : nowTime);
  const kadaiFetchedTimeString = kadaiFetchedTimestamp.toLocaleDateString() + " " + kadaiFetchedTimestamp.getHours() + ":" + ("00" + kadaiFetchedTimestamp.getMinutes()).slice(-2) + ":" + ("00" + kadaiFetchedTimestamp.getSeconds()).slice(-2);
  const quizFetchedTimestamp = new Date((typeof quizFetchedTime === "number")? quizFetchedTime : nowTime);
  const quizFetchedTimeString = quizFetchedTimestamp.toLocaleDateString() + " " + quizFetchedTimestamp.getHours() + ":" + ("00" + quizFetchedTimestamp.getMinutes()).slice(-2) + ":" + ("00" + quizFetchedTimestamp.getSeconds()).slice(-2);

  const addMemoBoxLectures: Array<Object> = [];

  const lectureIDMap = createLectureIDMap(lectureIDList);
  const dangerElements: Array<Object> = [];
  const warningElements: Array<Object> = [];
  const successElements: Array<Object> = [];
  const otherElements: Array<Object> = [];
  // loop over lectures
  kadaiList.forEach(item => {
    const lectureName = lectureIDMap.get(item.lectureID);
    // loop over kadais
    item.kadaiEntries.forEach(kadai => {
      const dispDue = formatTimestamp(kadai.dueDateTimestamp);
      const timeRemain = getTimeRemain((kadai.dueDateTimestamp*1000-nowTime) / 1000);
      const daysUntilDue = getDaysUntil(nowTime, kadai.dueDateTimestamp*1000);

      const remainTimeText = `あと${timeRemain[0]}日${timeRemain[1]}時間${timeRemain[2]}分`;
      const kadaiDueDateText = "" + dispDue;
      const kadaiTitle = "" + kadai.assignmentTitle;
      const kadaiChecked = kadai.isFinished;

      const entry = {
        timestamp: kadai.dueDateTimestamp,
        date: kadaiDueDateText,
        remain: remainTimeText,
        title: kadaiTitle,
        isMemo: kadai.isMemo,
        isQuiz: kadai.isQuiz,
        lectureId: item.lectureID,
        id: kadai.kadaiID,
        checked: kadaiChecked,
        href: item.getTopSite() == null ? "" : item.getTopSite()
      };
      const vars = {
        lectureName: lectureName,
        entries: [entry],
      };

      const appendElement = (lectureName: string|undefined, elements: Array<Object>) => {
        // @ts-ignore
        const lecName = elements.map(e => e.lectureName);
        if (lecName.includes(lectureName)){
          const idx = lecName.indexOf(lectureName);
          // @ts-ignore
          elements[idx].entries.push(entry);
          // @ts-ignore ソートする
          elements[idx].entries.sort((a, b) => {return a.timestamp - b.timestamp})
        } else {
          elements.push(vars);
        }
      };

      if (daysUntilDue > 0 && daysUntilDue <= 1) {
        appendElement(lectureName, dangerElements);
      } else if (daysUntilDue > 1 && daysUntilDue <= 5) {
        appendElement(lectureName, warningElements);
      } else if (daysUntilDue > 5 && daysUntilDue <= 14) {
        appendElement(lectureName, successElements);
      } else {
        appendElement(lectureName, otherElements);
      }
    });

    addMemoBoxLectures.push({
      id: item.lectureID,
      lectureName: lectureName
    });
  });

  const sortElements = (elements: Array<Object>) => {
    elements.sort((a, b) => {
      // @ts-ignore
      const timestamp = (o) => Math.min(...o.entries.map((p) => p.timestamp));
      return timestamp(a) - timestamp(b);
    });
    return elements;
  };

  let relaxPandA = null;
  if (kadaiList.length == 0) {
    relaxPandA = {
      img: chrome.extension.getURL("img/relaxPanda.png")
    };
  }

  const templateVars = {
    kadaiFetchedTime: kadaiFetchedTimeString,
    quizFetchedTime: quizFetchedTimeString,
    minipandaLogo: chrome.extension.getURL("img/logo.png"),
    VERSION: VERSION,
    dangerElements: sortElements(dangerElements),
    showDanger: dangerElements.length > 0,
    warningElements: sortElements(warningElements),
    showWarning: warningElements.length > 0,
    successElements: sortElements(successElements),
    showSuccess: successElements.length > 0,
    otherElements: sortElements(otherElements),
    showOther: otherElements.length > 0,
    addMemoBoxLectures: addMemoBoxLectures,
    subset: subset,
    showRelaxPandA: relaxPandA
  };

  fetch(chrome.extension.getURL("views/minisakai.mustache"))
    .then((res) => res.text())
    .then((template) => {
      const rendered = Mustache.render(template, templateVars);
      insertionProcess(rendered);
      registerEventHandlers(root);
      if (!subset) createSettingsTab(root);
      initState(root);
    });
}

function createMiniPandA(kadaiList: Array<Kadai>, lectureIDList: Array<LectureInfo>): void {
  createMiniPandAGeneralized(miniPandA, kadaiList, lectureIDList, false, (rendered) => {
      miniPandA.innerHTML = rendered;
      const parent = document.getElementById("pageBody");
      const ref = document.getElementById("toolMenuWrap");
      parent?.insertBefore(miniPandA, ref);
    }
  );
}

async function createSettingsTab(root: Element): Promise<void> {
  createSettingItem(root, "完了済の課題も色付けする", CPsettings.displayCheckedKadai ?? true, "displayCheckedKadai");
  createSettingItem(root, "課題キャッシュ時間 [秒]", CPsettings.kadaiCacheInterval ?? kadaiCacheInterval, "kadaiCacheInterval");
  createSettingItem(root, "クイズキャッシュ時間 [秒]", CPsettings.quizCacheInterval ?? quizCacheInterval, "quizCacheInterval");

  createSettingItem(root, "カラー① 締切24時間前", CPsettings.topColorDanger ?? "#f78989", "topColorDanger");
  createSettingItem(root, "カラー① 締切5日前", CPsettings.topColorWarning ?? "#fdd783", "topColorWarning");
  createSettingItem(root, "カラー① 締切14日前", CPsettings.topColorSuccess ?? "#8bd48d", "topColorSuccess");

  createSettingItem(root, "カラー② 締切24時間前", CPsettings.miniColorDanger ?? "#e85555", "miniColorDanger");
  createSettingItem(root, "カラー② 締切5日前", CPsettings.miniColorWarning ?? "#d7aa57", "miniColorWarning");
  createSettingItem(root, "カラー② 締切14日前", CPsettings.miniColorSuccess ?? "#62b665", "miniColorSuccess");

  createSettingItem(root, "デフォルト色に戻す", "reset", "reset");
  // @ts-ignore
  root.querySelector(".settings-tab")?.style.display = "none";
}

function createSettingItem(root: Element, itemDescription: string, value: boolean | number | string | null, id: string, display = true) {
  const settingsDiv = root.querySelector('.settings-tab');
  if (settingsDiv == null) {
    console.log(".settings-tab not found");
    return;
  }
  const mainDiv = SettingsDom.mainDiv.cloneNode(true);
  const label = SettingsDom.label.cloneNode(true);
  const p = SettingsDom.p.cloneNode(true);
  p.innerText = itemDescription;
  if (!display) mainDiv.style.display = "none";

  let settingItem;
  const span = SettingsDom.span.cloneNode(true);
  switch (typeof value){
    case "boolean":
      label.classList.add("switch");
      settingItem = cloneElem(SettingsDom.toggleBtn, {checked: value, id: id}, {"change": function (res: any) { updateSettings(res, "check");}});
      break;
    case "number":
      settingItem = cloneElem(SettingsDom.inputBox, {value: value, id: id}, {"change": function (res: any) { updateSettings(res, "number");}});
      break;
    case "string":
      if (id === "reset") {
        settingItem = cloneElem(SettingsDom.resetBtn, {value: value, id: id}, {"click": function (res: any) { updateSettings(res, "reset");}});
      } else {
        settingItem = cloneElem(SettingsDom.stringBox, {value: value, id: id}, {"change": function (res: any) { updateSettings(res, "string");}});
      }
      break;
    default:
      break;
  }

  if (typeof value === "boolean") appendChildAll(label, [settingItem, span]);
  else appendChildAll(label, [settingItem]);
  appendChildAll(mainDiv, [p, label]);
  settingsDiv.appendChild(mainDiv);
}

function registerEventHandlers(root: Element) {
  root.querySelector('#kadaiTab')?.addEventListener('click', () => toggleKadaiTab());
  root.querySelector('#settingsTab')?.addEventListener('click', () => toggleSettingsTab());
  root.querySelectorAll('.todo-check').forEach(c => c.addEventListener('change', (e) => toggleKadaiFinishedFlag(e)));
  root.querySelector('#close_btn')?.addEventListener('click', () => toggleMiniPandA());
  root.querySelector('.plus-button')?.addEventListener('click', () => toggleMemoBox());
  root.querySelector('#todo-add')?.addEventListener('click', () => addKadaiMemo());
  root.querySelectorAll('.del-button').forEach(b => b.addEventListener('click', (e) => deleteKadaiMemo(e)));
}

function initState(root: Element) {
  // @ts-ignore
  root.querySelector('#kadaiTab')?.checked = true;
  // @ts-ignore
  root.querySelector('.todoDue')?.value = new Date(`${new Date().toISOString().substr(0, 16)}-10:00`).toISOString().substr(0, 16);
}

async function displayMiniPandA(mergedKadaiList: Array<Kadai>, lectureIDList: Array<LectureInfo>): Promise<void>{
  createMiniPandA(mergedKadaiList, lectureIDList);
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
        } else if (daysUntilDue > 14) {
          defaultTab[j].classList.add("nav-other");
          for (let i = 0; i < aTagCount; i++) {
            defaultTab[j].getElementsByTagName("a")[i].classList.add("nav-other");
          }
        }
      }
    }
  }
  overrideCSSColor();
}

function overrideCSSColor() {
  const overwriteborder = function (className: string, color: string | undefined) {
    const dangerelem = document.getElementsByClassName(className);
    for (let i = 0; i < dangerelem.length; i++) {
      const elem = dangerelem[i] as HTMLElement;
      const attr = "solid 2px " + color;
      (<any>elem.style)["border-top"] = attr;
      (<any>elem.style)["border-left"] = attr;
      (<any>elem.style)["border-bottom"] = attr;
      (<any>elem.style)["border-right"] = attr;
    }
  };
  const overwritebackground = function (className: string, color: string | undefined) {
    const dangerelem = document.getElementsByClassName(className);
    for (let i = 0; i < dangerelem.length; i++) {
      const elem = dangerelem[i] as HTMLElement;
      elem.setAttribute("style", "background:" + color + "!important");
    }
  };
  overwriteborder("kadai-danger",CPsettings.miniColorDanger?? "#e85555");
  overwriteborder("kadai-success",CPsettings.miniColorSuccess?? "#62b665");
  overwriteborder("kadai-warning",CPsettings.miniColorWarning?? "#d7aa57");
  overwritebackground("lecture-danger",CPsettings.miniColorDanger?? "#e85555");
  overwritebackground("lecture-success",CPsettings.miniColorSuccess?? "#62b665");
  overwritebackground("lecture-warning",CPsettings.miniColorWarning?? "#d7aa57");

  overwritebackground("nav-danger",CPsettings.topColorDanger?? "#f78989");
  overwritebackground("nav-safe",CPsettings.topColorSuccess?? "#8bd48d");
  overwritebackground("nav-warning",CPsettings.topColorWarning?? "#fdd783");
  overwriteborder("nav-danger",CPsettings.topColorDanger?? "#f78989");
  overwriteborder("nav-safe",CPsettings.topColorSuccess?? "#8bd48d");
  overwriteborder("nav-warning",CPsettings.topColorWarning?? "#fdd783");
}

export {
  createHanburgerButton,
  createMiniPandA,
  displayMiniPandA,
  deleteNavBarNotification,
  createNavBarNotification
};
