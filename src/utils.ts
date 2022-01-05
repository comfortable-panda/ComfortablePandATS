import { Assignment, AssignmentEntry, CourseSiteInfo, DueCategory } from "./model";
import { saveToLocalStorage } from "./storage";
import { Settings } from "./settings";

export const nowTime = new Date().getTime();

/**
 * Calculate category of assignment due date
 * @param {number} dt1 standard time
 * @param {number} dt2 target time
 */
function getDaysUntil(dt1: number, dt2: number): DueCategory {
  let diff = (dt2 - dt1) / 1000;
  diff /= 3600 * 24;
  let category: DueCategory;
  if (diff > 0 && diff <= 1) {
    category = "due24h";
  } else if (diff > 1 && diff <= 5) {
    category = "due5d";
  } else if (diff > 5 && diff <= 14) {
    category = "due14d";
  } else if (diff > 14) {
    category = "dueOver14d";
  } else {
    category = "duePassed";
  }
  return category;
}

/**
 * Format timestamp for displaying
 * @param {number | undefined} timestamp
 */
function formatTimestamp(timestamp: number | undefined): string {
  const date = new Date(timestamp ? timestamp : nowTime);
  return (
    date.toLocaleDateString() +
    " " +
    date.getHours() +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2)
  );
}

/**
 * Creates a Map of courseID and course name.
 * @param {CourseSiteInfo[]} courseSiteInfos
 */
function createCourseIDMap(courseSiteInfos: Array<CourseSiteInfo>): Map<string, string> {
  const courseIDMap = new Map<string, string>();
  for (const courseSiteInfo of courseSiteInfos) {
    let courseName;
    if (courseSiteInfo.courseName === undefined) courseName = "";
    else courseName = courseSiteInfo.courseName;
    courseIDMap.set(courseSiteInfo.courseID, courseName);
  }
  return courseIDMap;
}

/**
 * Check if user is loggend in to Sakai.
 */
function isLoggedIn(): boolean {
  const scripts = document.getElementsByTagName("script");
  let loggedIn = false;
  for (const script of Array.from(scripts)) {
    if (script.text.match('"loggedIn": true')) loggedIn = true;
  }
  return loggedIn;
}

/**
 * Get courseID of current site.
 */
function getSiteCourseID(): string | undefined {
  const url = location.href;
  let courseID: string | undefined;
  const reg = new RegExp("(https?://[^/]+)/portal/site/([^/]+)");
  if (url.match(reg)) {
    courseID = url.match(reg)?.[2];
  }
  return courseID;
}

/**
 * Update new-assignment notification flags.
 * @param {Assignment[]} assignmentList
 */
function updateIsReadFlag(assignmentList: Array<Assignment>): void {
  const courseID = getSiteCourseID();
  const updatedAssignmentList = [];
  // TODO: Review this process
  if (courseID && courseID.length >= 17) {
    for (const assignment of assignmentList) {
      if (assignment.courseSiteInfo.courseID === courseID) {
        updatedAssignmentList.push(new Assignment(assignment.courseSiteInfo, assignment.assignmentEntries, true));
      } else {
        updatedAssignmentList.push(assignment);
      }
    }
    saveToLocalStorage("CS_AssignmentList", updatedAssignmentList);
  }
}

/**
 * Change loading icon to hamburger button.
 */
function miniSakaiReady(): void {
  const loadingIcon = document.getElementsByClassName("cs-loading")[0];
  const hamburgerIcon = document.createElement("img");
  hamburgerIcon.src = chrome.extension.getURL("img/miniSakaiBtn.png");
  hamburgerIcon.className = "cs-minisakai-btn";
  loadingIcon.className = "cs-minisakai-btn-div";
  loadingIcon.append(hamburgerIcon);
}

/**
 * Convert array to Settings class
 * @param {any} arr
 */
function convertArrayToSettings(arr: any): Settings {
  const settings = new Settings();
  settings.assignmentCacheInterval = arr.assignmentCacheInterval;
  settings.quizCacheInterval = arr.quizCacheInterval;
  settings.displayCheckedAssignment = arr.displayCheckedAssignment;
  settings.displayLateSubmitAssignment = arr.displayLateSubmitAssignment;
  settings.topColorDanger = arr.topColorDanger;
  settings.topColorWarning = arr.topColorWarning;
  settings.topColorSuccess = arr.topColorSuccess;
  settings.miniColorDanger = arr.miniColorDanger;
  settings.miniColorWarning = arr.miniColorWarning;
  settings.miniColorSuccess = arr.miniColorSuccess;
  return settings;
}

/**
 * Convert array to Assignment class
 * @param {any} arr
 */
function convertArrayToAssignment(arr: Array<any>): Array<Assignment> {
  const assignmentList = [];
  for (const i of arr) {
    const assignmentEntries = [];
    for (const e of i.assignmentEntries) {
      const entry = new AssignmentEntry(e.assignmentID, e.assignmentTitle, e.dueDateTimestamp, e.closeDateTimestamp, e.isMemo, e.isFinished, e.isQuiz ,e.assignmentDetail);
      entry.assignmentPage = e.assignmentPage;
      if (entry.getCloseDateTimestamp * 1000 > nowTime) assignmentEntries.push(entry);
    }
    assignmentList.push(new Assignment(new CourseSiteInfo(i.courseSiteInfo.courseID, i.courseSiteInfo.courseName), assignmentEntries, i.isRead))
  }
  return assignmentList;
}

/**
 * Compare old and new AssignmentList and merge them.
 * @param {Assignment[]} oldAssignmentiList
 * @param {Assignment[]} newAssignmentList
 */
function compareAndMergeAssignmentList(oldAssignmentiList: Array<Assignment>, newAssignmentList: Array<Assignment>): Array<Assignment>{
  const mergedAssignmentList = [];

  // Merge Assignments based on newAssignmentList
  for (const newAssignment of newAssignmentList) {
    const idx = oldAssignmentiList.findIndex((oldAssignment: Assignment) => {
      return oldAssignment.courseSiteInfo.courseID === newAssignment.courseSiteInfo.courseID;
    });

    // If this courseID is **NOT** in oldAssignmentList:
    if (idx === -1) {
      // Since this course site has a first assignment, set isRead flags to false.
      const isRead = newAssignment.assignmentEntries.length === 0;

      // Sort and add this to AssignmentList
      newAssignment.assignmentEntries.sort((a, b) => {
        return a.getDueDateTimestamp - b.getDueDateTimestamp;
      });
      mergedAssignmentList.push(new Assignment(newAssignment.courseSiteInfo, newAssignment.assignmentEntries, isRead));
    }

    // If this courseID **IS** in oldAssignmentList:
    else {
      // Take over isRead flag
      let isRead = oldAssignmentiList[idx].isRead;
      // Just in case if AssignmentList is empty, set flag to true
      if (newAssignment.assignmentEntries.length === 0) isRead = true;

      const mergedAssignmentEntries = [];
      for (const newAssignmentEntry of newAssignment.assignmentEntries) {
        // Find if this new assignment is in old AssignmentList
        const oldAssignment = oldAssignmentiList[idx] as Assignment;
        const q = oldAssignment.assignmentEntries.findIndex((oldAssignmentEntry) => {
          return oldAssignmentEntry.assignmentID === newAssignmentEntry.assignmentID;
        });
        // If there is same assignmentID, update it.
        if (q === -1) {
          // Set isRead flag to false since there might be some updates in assignment.
          isRead = false;
          mergedAssignmentEntries.push(newAssignmentEntry);
        }
        // If there is not, create a new AssignmentEntry for the course site.
        else {
          const entry = new AssignmentEntry(
            newAssignmentEntry.assignmentID,
            newAssignmentEntry.assignmentTitle,
            newAssignmentEntry.dueDateTimestamp,
            newAssignmentEntry.closeDateTimestamp,
            newAssignmentEntry.isMemo,
            oldAssignment.assignmentEntries[q].isFinished,
            newAssignmentEntry.isQuiz,
            newAssignmentEntry.assignmentDetail
          );
          entry.assignmentPage = newAssignmentEntry.assignmentPage;
          mergedAssignmentEntries.push(entry);
        }
      }
      // Sort AssignmentList
      mergedAssignmentEntries.sort((a, b) => {
        return a.getDueDateTimestamp - b.getDueDateTimestamp;
      });
      mergedAssignmentList.push(new Assignment(newAssignment.courseSiteInfo, mergedAssignmentEntries, isRead));
    }
  }
  return mergedAssignmentList;
}

/**
 * Merge Assignments, Quizzes, Memos together.
 * @param {Assignment[]} targetAssignmentList
 * @param {Assignment[]} newAssignmentList
 */
function mergeIntoAssignmentList(targetAssignmentList: Array<Assignment>, newAssignmentList: Array<Assignment>): Array<Assignment>{
  const mergedAssignmentList = [];
  for (const assignment of targetAssignmentList) {
    mergedAssignmentList.push(new Assignment(assignment.courseSiteInfo, assignment.assignmentEntries, assignment.isRead));
  }
  for (const newAssignment of newAssignmentList) {
    const idx = targetAssignmentList.findIndex((assignment: Assignment) => {
      return newAssignment.courseSiteInfo.courseID === assignment.courseSiteInfo.courseID;
    });

    const mergedAssignment = mergedAssignmentList[idx] as Assignment;
    if (idx !== -1) {
      mergedAssignment.assignmentEntries = mergedAssignment.assignmentEntries.concat(newAssignment.assignmentEntries);
    } else {
      mergedAssignmentList.push(new Assignment(newAssignment.courseSiteInfo, newAssignment.assignmentEntries, true));
    }
  }
  return mergedAssignmentList;
}

/**
 * Function for sorting Assignments
 * @param {Assignment[]} assignmentList
 */
function sortAssignmentList(assignmentList: Array<Assignment>): Array<Assignment> {
  return Array.from(assignmentList).sort((a, b) => {
    if (a.closestDueDateTimestamp > b.closestDueDateTimestamp) return 1;
    if (a.closestDueDateTimestamp < b.closestDueDateTimestamp) return -1;
    return 0;
  });
}

/**
 * Decides whether to use cache
 * @param {number | undefined} fetchedTime
 * @param {number} cacheInterval
 */
function useCache(fetchedTime: number | undefined, cacheInterval: number): boolean {
  if (fetchedTime) return (nowTime - fetchedTime) / 1000 <= cacheInterval;
  else return false;
}

/**
 * Generate unique ID
 * @param {string} prefix
 */
function genUniqueID(prefix: string): string {
  return prefix + new Date().getTime().toString(16) + Math.floor(123456 * Math.random()).toString(16);
}

export {
  getDaysUntil,
  createCourseIDMap,
  formatTimestamp,
  isLoggedIn,
  miniSakaiReady,
  convertArrayToSettings,
  convertArrayToAssignment,
  compareAndMergeAssignmentList,
  updateIsReadFlag,
  useCache,
  genUniqueID,
  mergeIntoAssignmentList,
  sortAssignmentList,
};
