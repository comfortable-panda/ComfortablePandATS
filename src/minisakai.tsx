import { Assignment, CourseSiteInfo, DisplayAssignment, DisplayAssignmentEntry } from "./model";
import { createCourseIDMap, getDaysUntil, formatTimestamp, nowTime, miniSakaiReady, getSakaiTheme } from "./utils";
import { appendChildAll, cloneElem, hamburger, miniSakai, SettingsDom } from "./dom";
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
import Mustache from "mustache";
import { Config, loadConfigs } from "./settings";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { createRoot } from 'react-dom/client';

const MiniSakaiContext = React.createContext<{
  config: Config | null
}>({
  config: null
});

type DueType = 'danger' | 'warning' | 'success' | 'other';

function useTranslation(tag: string): string {
  return useMemo(() => {
    return chrome.i18n.getMessage(tag);
  }, []);
}

function useTranslationDeps(tag: string, deps: React.DependencyList) {
  return useMemo(() => {
    return chrome.i18n.getMessage(tag);
  }, deps);
}

/**
 * Create a button to open miniSakai
 */
function createMiniSakaiBtn(): void {
  const topbar = document.getElementById("mastLogin");
  try {
    topbar?.appendChild(hamburger);
  } catch (e) {
    console.log("could not launch miniSakai.");
  }
}

export interface Renderable {
  render(): [React.Component, number][];
}

function MiniSakaiLogo() {
  const src = chrome.runtime.getURL("img/logo.png");
  return (
    <img className="cs-minisakai-logo" alt="logo" src={src} />
  );
}

function MiniSakaiVersion() {
  const ctx = useContext(MiniSakaiContext);
  return (
    <p className="cs-version">Version {ctx.config === null ? "" : ctx.config.version}</p>
  );
}

function MiniSakaiClose(props: { onClose: () => void }) {
  return (
    <a className="closebtn q" href="#" onClick={props.onClose}>x</a>
  );
}

function MiniSakaiTabs(props: {
  onAssignment: () => void,
  onSettings: () => void
}) {
  const assignmentTab = useTranslation("tab_assignments");
  const settingsTab = useTranslation("tab_settings");
  return (
    <>
      <input id="assignmentTab" type="radio" name="cs-tab" onClick={props.onAssignment} />
      <label htmlFor="assignmentTab"> {assignmentTab} </label>
      <input id="settingsTab" type="radio" name="cs-tab" onClick={props.onSettings} />
      <label htmlFor="settingsTab"> {settingsTab} </label>
    </>
  );
}

function MiniSakaiTimeBox(props: {
  clazz: string,
  title: string,
  time: string
}) {
  return (
    <div className={props.clazz}>
      <p className="cs-assignment-time-text">{props.title}</p>
      <p className="cs-assignment-time-text">{props.time}</p>
    </div>
  );
}

function MiniSakaiAssignmentTime() {
  const ctx = useContext(MiniSakaiContext);
  const title = useTranslation("assignment_acquisition_date");
  const time = ctx.config === null ? "" : formatTimestamp(ctx.config.fetchedTime.assignment);
  return <MiniSakaiTimeBox clazz="cs-assignment-time" title={title} time={time} />
}

function MiniSakaiQuizTime() {
  const ctx = useContext(MiniSakaiContext);
  const title = useTranslation("testquiz_acquisition_date");
  const time = ctx.config === null ? "" : formatTimestamp(ctx.config.fetchedTime.quiz);
  return <MiniSakaiTimeBox clazz="cs-quiz-time" title={title} time={time} />
}

function AssignmentTab(props: {
  isSubset: boolean,
  showMemoBox: boolean
}) {

  return (
    <>
      <AddMemoBox shown={!props.isSubset && props.showMemoBox} courseSites={[]} />
    </>
  );
}

// TODO
function AddMemoBox(props: {
  shown: boolean,
  courseSites: CourseSiteInfo[]
}) {
  const courseName = useTranslation("todo_box_course_name");
  const memoLabel = useTranslation("todo_box_memo");
  const dueDate = useTranslation("todo_box_due_date");
  const addBtnLabel = useTranslation("todo_box_add");

  const [todoContent, setTodoContent] = useState("");
  const [todoDue, setTodoDue] = useState("");

  const options = useMemo(() => {
    return props.courseSites.map(site => {
      return <option value={site.courseID}>{site.courseName}</option>;
    });
  }, [props.courseSites]);

  if (!props.shown) {
    return <div></div>
  }

  function MiniSakaiColoredTitle(props: {
    dueType: DueType
  }) {
    let titleTag = '';
    let clazz = '';
    switch (props.dueType) {
      case 'danger':
        clazz = 'cs-minisakai-danger';
        titleTag = 'due24h';
        break;
      case 'warning':
        clazz = 'cs-minisakai-warning';
        titleTag = 'due5d';
        break;
      case 'success':
        clazz = 'cs-minisakai-success';
        titleTag = 'due14d';
        break;
      case 'other':
        clazz = 'cs-minisakai-other';
        titleTag = 'dueOver14d';
        break;
    }

    let title = useTranslationDeps(titleTag, [titleTag]);

    return (<div className={clazz}>
      <span className="q">{title}</span>
    </div>);
  }

  function MiniSakaiEntryList(props: {
    dueType: DueType,
    children: React.ReactNode
  }) {
    const baseClass = 'cs-minisakai-list';
    let clazz = '';
    switch (props.dueType) {
      case 'danger':
        clazz = 'cs-minisakai-list-danger';
        break;
      case 'warning':
        clazz = 'cs-minisakai-list-warning';
        break;
      case 'success':
        clazz = 'cs-minisakai-list-success';
        break;
      case 'other':
        clazz = 'cs-minisakai-list-other';
        break;
    }
    const className = `${baseClass} ${clazz}`;
    return (
      <div className={className}>
        {props.children}
      </div>
    );
  }

  return (
    <div className="cs-memo-box addMemoBox">
      <div className="cs-memo-item">
        <p>{courseName}</p>
        <label>
          <select className="todoLecName">
            {options}
          </select>
        </label>
      </div>
      <div className="cs-memo-item">
        <p>{memoLabel}</p>
        <label>
          <input type="text" className="todoContent"
            value={todoContent}
            onChange={(ev) => setTodoContent(ev.target.value)}
          />
        </label>
      </div>
      <div className="cs-memo-item">
        <p>{dueDate}</p>
        <label>
          <input type="datetime-local" className="todoDue"
            value={todoDue}
            onChange={(ev) => setTodoDue(ev.target.value)}
          />
        </label>
      </div>
      <div className="cs-memo-item">
        <button type="submit" id="todo-add">{addBtnLabel}</button>
      </div>
    </div>
  );
}

export function MiniSakaiRoot({ subset }: {
  subset: boolean,
}): JSX.Element {
  const [config, setConfig] = useState<Config | null>(null);
  useEffect(() => {
    loadConfigs().then((c) => setConfig(c));
  }, []);

  const [shownTab, setShownTab] = useState<'assignment' | 'settings'>('assignment');
  const [memoBoxShown, setMemoBoxShown] = useState(false);

  return (
    <MiniSakaiContext.Provider value={{
      config: config
    }}>
      <MiniSakaiLogo />
      <MiniSakaiVersion />
      {(subset ? null :
        (<>
          <MiniSakaiClose onClose={() => toggleMiniSakai()} />
          <MiniSakaiTabs
            onAssignment={() => setShownTab('assignment')}
            onSettings={() => setShownTab('settings')}
          />
          {
            (shownTab === 'assignment') ?
              <>
                <button className="cs-add-memo-btn" onClick={() => {
                  setMemoBoxShown(s => !s);
                }}>+</button>
                <MiniSakaiAssignmentTime />
                <MiniSakaiQuizTime />
              </>
              : null
          }
        </>)
      )}
      <AssignmentTab showMemoBox={memoBoxShown} isSubset={subset} />
    </MiniSakaiContext.Provider>
  );
}

/**
 * Using template engine to generate miniSakai list.
 * DEPRECATED
 */
export async function createMiniSakaiGeneralized(root: Element, assignmentList: Array<Assignment>, courseSiteInfos: Array<CourseSiteInfo>, subset: boolean, insertionProcess: (rendered: string) => void): Promise<void> {
  const config = await loadConfigs();
  const assignmentFetchedTimeString = formatTimestamp(config.fetchedTime.assignment);
  const quizFetchedTimeString = formatTimestamp(config.fetchedTime.quiz);
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
          // eslint-disable-next-line no-case-declarations
          const showLateSubmitAssignment = config.CSsettings ? config.CSsettings.getDisplayLateSubmitAssignment : false;
          if (showLateSubmitAssignment && getDaysUntil(nowTime, assignmentEntry.getCloseDateTimestamp * 1000) !== "duePassed") {
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

  let noAssignmentImg = null;
  let assignmentCnt = 0;
  if (assignmentList.length !== 0) {
    for (const assignment of assignmentList) {
      assignmentCnt += assignment.assignmentEntries.length;
    }
  }
  if (assignmentList.length === 0 || assignmentCnt === 0) {
    noAssignmentImg = {
      img: chrome.runtime.getURL("img/noAssignment.png"),
    };
  }

  // Create dict of data for miniSakai
  const templateVars = {
    fetchedTime: {
      assignment: assignmentFetchedTimeString,
      quiz: quizFetchedTimeString,
    },
    miniSakaiLogo: chrome.runtime.getURL("img/logo.png"),
    VERSION: config.version,
    subset: subset,
    noAssignment: noAssignmentImg,
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
      noAssignment: chrome.i18n.getMessage("no_available_assignments"),
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

  // Load mustache
  fetch(chrome.runtime.getURL("views/minisakai.mustache"))
    .then((res) => res.text())
    .then((template) => {
      const rendered = Mustache.render(template, templateVars);
      insertionProcess(rendered);
      registerEventHandlers(root);
      if (!subset) createSettingsTab(root);
      initState(root);
    });
}

/**
 * Insert miniSakai into Sakai.
 */
function createMiniSakai(assignmentList: Array<Assignment>, courseSiteInfos: Array<CourseSiteInfo>) {
  const parent = document.getElementById("pageBody");
  const ref = document.getElementById("toolMenuWrap");
  parent?.insertBefore(miniSakai, ref);
  const root = createRoot(miniSakai);
  root.render(<MiniSakaiRoot subset={false} />);
}

/**
 * Initialize Settings tab.
 */
async function createSettingsTab(root: Element) {
  const config = await loadConfigs();
  createSettingItem(root, chrome.i18n.getMessage('settings_color_checked_item'), config.CSsettings.getDisplayCheckedAssignment, "displayCheckedAssignment");
  createSettingItem(root, chrome.i18n.getMessage('settings_display_late_submit_assignment'), config.CSsettings.getDisplayLateSubmitAssignment, "displayLateSubmitAssignment");
  createSettingItem(root, chrome.i18n.getMessage('settings_assignment_cache'), config.CSsettings.getAssignmentCacheInterval, "assignmentCacheInterval");
  createSettingItem(root, chrome.i18n.getMessage('settings_quizzes_cache'), config.CSsettings.getQuizCacheInterval, "quizCacheInterval");

  createSettingItem(root, chrome.i18n.getMessage('settings_colors_hour', ['Tab Bar', '24']), config.CSsettings.getTopColorDanger, "topColorDanger");
  createSettingItem(root, chrome.i18n.getMessage('settings_colors_day', ['Tab Bar', '5']), config.CSsettings.getTopColorWarning, "topColorWarning");
  createSettingItem(root, chrome.i18n.getMessage('settings_colors_day', ['Tab Bar', '14']), config.CSsettings.getTopColorSuccess, "topColorSuccess");

  createSettingItem(root, chrome.i18n.getMessage('settings_colors_hour', ['miniPandA', '24']), config.CSsettings.getMiniColorDanger, "miniColorDanger");
  createSettingItem(root, chrome.i18n.getMessage('settings_colors_day', ['miniPandA', '5']), config.CSsettings.getMiniColorWarning, "miniColorWarning");
  createSettingItem(root, chrome.i18n.getMessage('settings_colors_day', ['miniPandA', '14']), config.CSsettings.getMiniColorSuccess, "miniColorSuccess");

  createSettingItem(root, chrome.i18n.getMessage("settings_reset_colors"), "reset", "reset");
  // @ts-ignore
  root.querySelector(".cs-settings-tab").style.display = "none";
}

/**
 * Create Settings tab item.
 */
function createSettingItem(root: Element, itemDescription: string, value: boolean | number | string | null, id: string, display = true) {
  const settingsDiv = root.querySelector(".cs-settings-tab");
  if (settingsDiv == null) {
    console.log(".cs-settings-tab not found");
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
      label.classList.add("cs-toggle-btn");
      settingItem = cloneElem(SettingsDom.toggleBtn, { checked: value, id: id }, { "change": function (res: any) { updateSettings(res, "check"); } });
      break;
    case "number":
      settingItem = cloneElem(SettingsDom.inputBox, { value: value, id: id }, { "change": function (res: any) { updateSettings(res, "number"); } });
      break;
    case "string":
      if (id === "reset") {
        settingItem = cloneElem(SettingsDom.resetBtn, { value: value, id: id }, { "click": function (res: any) { updateSettings(res, "reset"); } });
      } else {
        settingItem = cloneElem(SettingsDom.stringBox, { value: value, id: id }, { "change": function (res: any) { updateSettings(res, "string"); } });
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

/**
 * Add event listener to each Settings item
 */
function registerEventHandlers(root: Element) {
  root.querySelector("#assignmentTab")?.addEventListener("click", () => toggleAssignmentTab());
  root.querySelector("#settingsTab")?.addEventListener("click", () => toggleSettingsTab());
  root.querySelectorAll(".cs-checkbox").forEach((c) => c.addEventListener("change", (e) => toggleFinishedFlag(e)));
  root.querySelector("#cs-add-memo-btn")?.addEventListener("click", () => toggleMemoBox());
  root.querySelector("#todo-add")?.addEventListener("click", () => addMemo());
  root.querySelectorAll(".cs-del-memo-btn").forEach((b) => b.addEventListener("click", (e) => deleteMemo(e)));
}

/**
 * Initialize states
 */
function initState(root: Element) {
  // @ts-ignore
  root.querySelector("#assignmentTab").checked = true;
  // @ts-ignore
  root.querySelector(".todoDue").value = new Date(`${new Date().toISOString().substr(0, 16)}-10:00`)
    .toISOString()
    .substr(0, 16);
}

/**
 * Display miniSakai
 */
function displayMiniSakai(mergedAssignmentList: Array<Assignment>, courseSiteInfos: Array<CourseSiteInfo>) {
  createMiniSakai(mergedAssignmentList, courseSiteInfos);
}

/**
 * Add notification badge for new Assignment/Quiz
 */
async function createFavoritesBarNotification(courseSiteInfos: Array<CourseSiteInfo>, assignmentList: Array<Assignment>): Promise<void> {
  const config = await loadConfigs();
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
        const closestTime = (config.CSsettings.displayCheckedAssignment) ? assignmentList[q].closestDueDateTimestamp : assignmentList[q].closestDueDateTimestampExcludeFinished;
        if (!assignmentList[q].isRead && closestTime !== -1) {
          defaultTab[j].classList.add("cs-notification-badge");
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
            defaultTab[j].classList.add("cs-tab-success");
            for (let i = 0; i < aTagCount; i++) {
              defaultTab[j].getElementsByTagName("a")[i].classList.add("cs-tab-success");
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
  await overrideCSSColor();
  overrideCSSDarkTheme();
}

/**
 * Delete notification badge for new Assignment/Quiz
 */
function deleteFavoritesBarNotification(): void {
  const classlist = ["cs-notification-badge", "cs-tab-danger", "cs-tab-warning", "cs-tab-success"];
  for (const c of classlist) {
    const q = document.querySelectorAll(`.${c}`);
    // @ts-ignore
    for (const _ of q) {
      _.classList.remove(`${c}`);
      _.style = "";
    }
  }
}

const overwriteborder = function (className: string, color: string | undefined) {
  const element = document.getElementsByClassName(className);
  for (let i = 0; i < element.length; i++) {
    const elem = element[i] as HTMLElement;
    const attr = "solid 2px " + color;
    (elem.style as any)["border-top"] = attr;
    (elem.style as any)["border-left"] = attr;
    (elem.style as any)["border-bottom"] = attr;
    (elem.style as any)["border-right"] = attr;
  }
};
const overwritebackground = function (className: string, color: string | undefined) {
  const element = document.getElementsByClassName(className);
  for (let i = 0; i < element.length; i++) {
    const elem = element[i] as HTMLElement;
    elem.setAttribute("style", "background:" + color + "!important");
  }
};
const overwritecolor = function (className: string, color: string | undefined) {
  const element = document.getElementsByClassName(className);
  for (let i = 0; i < element.length; i++) {
    const elem = element[i] as HTMLElement;
    elem.setAttribute("style", elem.getAttribute("style") + ";color:" + color + "!important");
  }
};

/**
 * Override CSS of favorites bar and miniSakai.
 */
async function overrideCSSColor() {
  const config = await loadConfigs();

  // Overwrite colors
  overwritebackground("cs-course-danger", config.CSsettings.getMiniColorDanger);
  overwritebackground("cs-course-warning", config.CSsettings.getMiniColorWarning);
  overwritebackground("cs-course-success", config.CSsettings.getMiniColorSuccess);
  overwritebackground("cs-tab-danger", config.CSsettings.getTopColorDanger);
  overwritebackground("cs-tab-warning", config.CSsettings.getTopColorWarning);
  overwritebackground("cs-tab-success", config.CSsettings.getTopColorSuccess);

  overwriteborder("cs-assignment-danger", config.CSsettings.getMiniColorDanger);
  overwriteborder("cs-assignment-warning", config.CSsettings.getMiniColorWarning);
  overwriteborder("cs-assignment-success", config.CSsettings.getMiniColorSuccess);
  overwriteborder("cs-tab-danger", config.CSsettings.getTopColorDanger);
  overwriteborder("cs-tab-warning", config.CSsettings.getTopColorWarning);
  overwriteborder("cs-tab-success", config.CSsettings.getTopColorSuccess);

}

function overrideCSSDarkTheme() {
  if (getSakaiTheme() == 'dark') {
    let foregroundColorDark = "#D4D4D4";
    let backgroundColorDark = "#555555";
    let dateColorDark = "#e07071";
    overwritebackground("cs-minisakai", backgroundColorDark);
    overwritecolor("cs-assignment-time", foregroundColorDark);
    overwritecolor("cs-assignment-date", dateColorDark);
    overwritecolor("cs-quiz-time", foregroundColorDark);
    overwritecolor("cs-minipanda", foregroundColorDark);
    overwritecolor("cs-settings-tab", foregroundColorDark);
    overwritecolor("cs-memo-item", foregroundColorDark);
    overwritecolor("cs-minisakai-list", foregroundColorDark);
    overwritecolor("cs-assignment-title", foregroundColorDark);
    overwritecolor("cs-noassignment-p", foregroundColorDark);
    overwritecolor("cs-tab-danger", backgroundColorDark);
    overwritecolor("cs-tab-warning", backgroundColorDark);
    overwritecolor("cs-tab-success", backgroundColorDark);
  }
}

export {
  createMiniSakaiBtn,
  createMiniSakai,
  displayMiniSakai,
  deleteFavoritesBarNotification,
  createFavoritesBarNotification,
};
