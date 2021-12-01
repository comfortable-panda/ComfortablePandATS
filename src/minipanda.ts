import { Assignment, CourseSiteInfo, DisplayAssignment, DisplayAssignmentEntry } from "./model";
import { createCourseIDMap, getDaysUntil, formatTimestamp, nowTime } from "./utils";
import { appendChildAll, cloneElem, hamburger, miniPandA, SettingsDom } from "./dom";
import { CPsettings, assignmentFetchedTime, quizFetchedTime, VERSION } from "./content_script";
import {
  addMemo,
  deleteMemo,
  toggleFinishedFlag,
  toggleAssignmentTab,
  toggleMemoBox,
  toggleMiniSakai,
  toggleSettingsTab,
  updateSettings,
} from "./eventListener";
// @ts-ignore
import Mustache = require("mustache");

function createMiniSakaiBtn(): void {
  const topbar = document.getElementById("mastLogin");
  try {
    topbar?.appendChild(hamburger);
  } catch (e) {
    console.log("could not launch miniSakai.");
  }
}

export function createMiniPandAGeneralized(root: Element, assignmentList: Array<Assignment>, courseSiteInfos: Array<CourseSiteInfo>, subset: boolean, insertionProcess: (rendered: string) => void): void {
  const assignmentFetchedTimeString = formatTimestamp(assignmentFetchedTime);
  const quizFetchedTimeString = formatTimestamp(quizFetchedTime);

  const courseSiteList: Array<CourseSiteInfo> = [];

  const courseIDMap = createCourseIDMap(courseSiteInfos);
  const dangerElements: Array<DisplayAssignment> = [];
  const warningElements: Array<DisplayAssignment> = [];
  const successElements: Array<DisplayAssignment> = [];
  const otherElements: Array<DisplayAssignment> = [];
  const lateSubmitElements: Array<DisplayAssignment> = [];
  // iterate over courseSite
  assignmentList.forEach((assignment) => {
    const courseName = courseIDMap.get(assignment.courseSiteInfo.courseID);
    // iterate over assignment entries
    assignment.assignmentEntries.forEach((assignmentEntry) => {
      const daysUntilDue = getDaysUntil(nowTime, assignmentEntry.getDueDateTimestamp * 1000);

      const displayAssignmentEntry = new DisplayAssignmentEntry(
        assignment.courseSiteInfo.courseID,
        assignmentEntry.assignmentID,
        assignmentEntry.assignmentTitle,
        assignmentEntry.dueDateTimestamp,
        assignmentEntry.closeDateTimestamp,
        assignmentEntry.isFinished,
        assignmentEntry.isQuiz,
        assignmentEntry.isMemo
      );

      const displayAssignment = new DisplayAssignment([displayAssignmentEntry], courseName, assignment.getTopSite());

      const appendElement = (courseName: string | undefined, displayAssignments: Array<DisplayAssignment>) => {
        const courseNameMap = displayAssignments.map((e) => e.courseName);
        if (courseNameMap.includes(courseName)) {
          const idx = courseNameMap.indexOf(courseName);
          displayAssignments[idx].assignmentEntries.push(displayAssignmentEntry);
          displayAssignments[idx].assignmentEntries.sort((a, b) => {
            return a.getDueDateTimestamp - b.getDueDateTimestamp;
          });
        } else {
          displayAssignments.push(displayAssignment);
        }
      };

      // Append elements according to due date category
      switch (daysUntilDue) {
        case "due24h":
          appendElement(courseName, dangerElements);
          break;
        case "due5d":
          appendElement(courseName, warningElements);
          break;
        case "due14d":
          appendElement(courseName, successElements);
          break;
        case "dueOver14d":
          appendElement(courseName, otherElements);
          break;
        case "duePassed":
          if (CPsettings.getDisplayLateSubmitAssignment && getDaysUntil(nowTime, assignmentEntry.getCloseDateTimestamp * 1000) !== "duePassed") {
            appendElement(courseName, lateSubmitElements);
          }
          break;
      }
    });

    courseSiteList.push(new CourseSiteInfo(assignment.courseSiteInfo.courseID, courseName));
  });

  const sortElements = (elements: Array<DisplayAssignment>, isLateSubmission = false) => {
    elements.sort((a, b) => {
      let timestamp;
      if (isLateSubmission) {
        timestamp = (o: DisplayAssignment) => Math.min(...o.assignmentEntries.map((p) => p.getCloseDateTimestamp));
      } else {
        timestamp = (o: DisplayAssignment) => Math.min(...o.assignmentEntries.map((p) => p.getDueDateTimestamp));
      }
      return timestamp(a) - timestamp(b);
    });
    return elements;
  };

  let relaxPandA = null;
  let assignmentCnt = 0;
  if (assignmentList.length !== 0) {
    for (const assignment of assignmentList) {
      assignmentCnt += assignment.assignmentEntries.length;
    }
  }
  if (assignmentList.length === 0 || assignmentCnt === 0) {
    relaxPandA = {
      img: chrome.extension.getURL("img/relaxPanda.png"),
    };
  }

  const templateVars = {
    fetchedTime: {
      assignment: assignmentFetchedTimeString,
      quiz: quizFetchedTimeString,
    },
    minipandaLogo: chrome.extension.getURL("img/logo.png"),
    VERSION: VERSION,
    subset: subset,
    showRelaxPandA: relaxPandA,
    elements: {
      danger: sortElements(dangerElements),
      warning: sortElements(warningElements),
      success: sortElements(successElements),
      other: sortElements(otherElements),
      lateSubmit: sortElements(lateSubmitElements, true),
    },
    display: {
      danger: dangerElements.length > 0,
      warning: warningElements.length > 0,
      success: successElements.length > 0,
      other: otherElements.length > 0,
      lateSubmit: lateSubmitElements.length > 0,
    },
    titles: {
      assignmentTab: chrome.i18n.getMessage("tab_assignments"),
      settingsTab: chrome.i18n.getMessage("tab_settings"),
      assignmentFetchedTime: chrome.i18n.getMessage("assignment_acquisition_date"),
      quizFetchedTime: chrome.i18n.getMessage("testquiz_acquisition_date"),
      due24h: chrome.i18n.getMessage("due24h"),
      due5d: chrome.i18n.getMessage("due5d"),
      due14d: chrome.i18n.getMessage("due14d"),
      dueOver14d: chrome.i18n.getMessage("dueOver14d"),
      duePassed: chrome.i18n.getMessage("duePassed"),
      relaxPandA: chrome.i18n.getMessage("no_available_assignments"),
    },
    todoBox: {
      courseName: chrome.i18n.getMessage("todo_box_course_name"),
      memoLabel: chrome.i18n.getMessage("todo_box_memo"),
      dueDate: chrome.i18n.getMessage("todo_box_due_date"),
      addBtnLabel: chrome.i18n.getMessage("todo_box_add"),
      courseSiteList: courseSiteList,
    },
    badge: {
      memo: chrome.i18n.getMessage("memo"),
      quiz: chrome.i18n.getMessage("quiz"),
    },
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

function createMiniPandA(assignmentList: Array<Assignment>, courseSiteInfos: Array<CourseSiteInfo>): void {
  createMiniPandAGeneralized(miniPandA, assignmentList, courseSiteInfos, false, (rendered) => {
    miniPandA.innerHTML = rendered;
    const parent = document.getElementById("pageBody");
    const ref = document.getElementById("toolMenuWrap");
    parent?.insertBefore(miniPandA, ref);
  });
}

async function createSettingsTab(root: Element): Promise<void> {
  createSettingItem(root, chrome.i18n.getMessage('settings_color_checked_item'), CPsettings.getDisplayCheckedKadai, "displayCheckedKadai");
  createSettingItem(root, chrome.i18n.getMessage('settings_display_late_submit_assignment'), CPsettings.getDisplayLateSubmitAssignment, "displayLateSubmitAssignment");
  createSettingItem(root, chrome.i18n.getMessage('settings_assignment_cache'), CPsettings.getAssignmentCacheInterval, "assignmentCacheInterval");
  createSettingItem(root, chrome.i18n.getMessage('settings_quizzes_cache'), CPsettings.getQuizCacheInterval, "quizCacheInterval");

  createSettingItem(root, chrome.i18n.getMessage('settings_colors_hour', ['1', 24]), CPsettings.getTopColorDanger, "topColorDanger");
  createSettingItem(root, chrome.i18n.getMessage('settings_colors_day', ['1', 5]), CPsettings.getTopColorWarning, "topColorWarning");
  createSettingItem(root, chrome.i18n.getMessage('settings_colors_day', ['1', 14]), CPsettings.getTopColorSuccess, "topColorSuccess");

  createSettingItem(root, chrome.i18n.getMessage('settings_colors_hour', ['2', 24]), CPsettings.getMiniColorDanger, "miniColorDanger");
  createSettingItem(root, chrome.i18n.getMessage('settings_colors_day', ['2', 5]), CPsettings.getMiniColorWarning, "miniColorWarning");
  createSettingItem(root, chrome.i18n.getMessage('settings_colors_day', ['2', 14]), CPsettings.getMiniColorSuccess, "miniColorSuccess");

  createSettingItem(root, chrome.i18n.getMessage('settings_reset_colors'), "reset", "reset");
  // @ts-ignore
  root.querySelector(".settings-tab")?.style.display = "none";
}

function createSettingItem(root: Element, itemDescription: string, value: boolean | number | string | null, id: string, display = true) {
  const settingsDiv = root.querySelector(".settings-tab");
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
  switch (typeof value) {
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
  root.querySelector("#kadaiTab")?.addEventListener("click", () => toggleAssignmentTab());
  root.querySelector("#settingsTab")?.addEventListener("click", () => toggleSettingsTab());
  root.querySelectorAll(".todo-check").forEach((c) => c.addEventListener("change", (e) => toggleFinishedFlag(e)));
  root.querySelector("#close_btn")?.addEventListener("click", () => toggleMiniSakai());
  root.querySelector("#plus-button")?.addEventListener("click", () => toggleMemoBox());
  root.querySelector("#todo-add")?.addEventListener("click", () => addMemo());
  root.querySelectorAll(".del-button").forEach((b) => b.addEventListener("click", (e) => deleteMemo(e)));
}

function initState(root: Element) {
  // @ts-ignore
  root.querySelector("#kadaiTab")?.checked = true;
  // @ts-ignore
  root.querySelector(".todoDue")?.value = new Date(`${new Date().toISOString().substr(0, 16)}-10:00`)
    .toISOString()
    .substr(0, 16);
}

async function displayMiniPandA(mergedAssignmentList: Array<Assignment>, courseSiteInfos: Array<CourseSiteInfo>): Promise<void>{
  createMiniPandA(mergedAssignmentList, courseSiteInfos);
}

function deleteNavBarNotification(): void {
  const classlist = ["red-badge", "cs-tab-danger", "cs-tab-warning", "cs-tab-safe"];
  for (const c of classlist) {
    const q = document.querySelectorAll(`.${c}`);
    // @ts-ignore
    for (const _ of q) {
      _.classList.remove(`${c}`);
      _.style = "";
    }
  }
}

function createNavBarNotification(courseSiteInfos: Array<CourseSiteInfo>, assignmentList: Array<Assignment>): void {
  const defaultTab = document.querySelectorAll(".Mrphs-sitesNav__menuitem");
  const defaultTabCount = Object.keys(defaultTab).length;

  for (const courseSiteInfo of courseSiteInfos) {
    for (let j = 2; j < defaultTabCount; j++) {
      // @ts-ignore
      const courseID = defaultTab[j].getElementsByClassName("link-container")[0].href.match("(https?://[^/]+)/portal/site-?[a-z]*/([^/]+)")[2];

      const q = assignmentList.findIndex((assignment: Assignment) => {
        return assignment.courseSiteInfo.courseID === courseID;
      });
      if (q !== -1) {
        const closestTime = (CPsettings.displayCheckedKadai) ? assignmentList[q].closestDueDateTimestamp : assignmentList[q].closestDueDateTimestampExcludeFinished;
        if (!assignmentList[q].isRead && closestTime !== -1) {
          defaultTab[j].classList.add("red-badge");
        }
        const daysUntilDue = getDaysUntil(nowTime, closestTime * 1000);
        const aTagCount = defaultTab[j].getElementsByTagName("a").length;

        switch (daysUntilDue) {
          case "due24h":
            defaultTab[j].classList.add("cs-tab-danger");
            for (let i = 0; i < aTagCount; i++) {
              defaultTab[j].getElementsByTagName("a")[i].classList.add("cs-tab-danger");
            }
            break;
          case "due5d":
            defaultTab[j].classList.add("cs-tab-warning");
            for (let i = 0; i < aTagCount; i++) {
              defaultTab[j].getElementsByTagName("a")[i].classList.add("cs-tab-warning");
            }
            break;
          case "due14d":
            defaultTab[j].classList.add("cs-tab-safe");
            for (let i = 0; i < aTagCount; i++) {
              defaultTab[j].getElementsByTagName("a")[i].classList.add("cs-tab-safe");
            }
            break;
          case "dueOver14d":
            defaultTab[j].classList.add("cs-tab-other");
            for (let i = 0; i < aTagCount; i++) {
              defaultTab[j].getElementsByTagName("a")[i].classList.add("cs-tab-other");
            }
            break;
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
  overwriteborder("cs-assignment-danger", CPsettings.getMiniColorDanger);
  overwriteborder("cs-assignment-success", CPsettings.getMiniColorSuccess);
  overwriteborder("cs-assignment-warning", CPsettings.getMiniColorWarning);
  overwritebackground("lecture-danger", CPsettings.getMiniColorDanger);
  overwritebackground("lecture-success", CPsettings.getMiniColorSuccess);
  overwritebackground("lecture-warning", CPsettings.getMiniColorWarning);

  overwritebackground("cs-tab-danger", CPsettings.getTopColorDanger);
  overwritebackground("cs-tab-safe", CPsettings.getTopColorSuccess);
  overwritebackground("cs-tab-warning", CPsettings.getTopColorWarning);
  overwriteborder("cs-tab-danger", CPsettings.getTopColorDanger);
  overwriteborder("cs-tab-safe", CPsettings.getTopColorSuccess);
  overwriteborder("cs-tab-warning", CPsettings.getTopColorWarning);
}

export { createMiniSakaiBtn, createMiniPandA, displayMiniPandA, deleteNavBarNotification, createNavBarNotification };
