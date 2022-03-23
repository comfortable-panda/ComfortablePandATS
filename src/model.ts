import { nowTime } from "./utils";

export type DueCategory = "due24h" | "due5d" | "due14d" | "dueOver14d" | "duePassed";
const MAX_TIMESTAMP = 99999999999999;

export class AssignmentEntry {
  assignmentID: string;
  assignmentTitle: string;
  assignmentDetail?: string;
  dueDateTimestamp: number | null;
  closeDateTimestamp: number | null;
  isMemo: boolean;
  isFinished: boolean;
  assignmentPage?: string;
  isQuiz: boolean;

  constructor(
    assignmentID: string,
    assignmentTitle: string,
    dueDateTimestamp: number | null,
    closeDateTimestamp: number | null,
    isMemo: boolean,
    isFinished: boolean,
    isQuiz: boolean,
    assignmentDetail?: string,
    assignmentPage?: string
  ) {
    this.assignmentID = assignmentID;
    this.assignmentTitle = assignmentTitle;
    this.assignmentDetail = assignmentDetail;
    this.dueDateTimestamp = dueDateTimestamp;
    this.closeDateTimestamp = closeDateTimestamp;
    this.isMemo = isMemo;
    this.isFinished = isFinished;
    this.isQuiz = isQuiz;
    this.assignmentPage = assignmentPage;
  }

  get getDueDateTimestamp(): number {
    return this.dueDateTimestamp ? this.dueDateTimestamp : MAX_TIMESTAMP;
  }
  get getCloseDateTimestamp(): number {
    return this.closeDateTimestamp ? this.closeDateTimestamp : MAX_TIMESTAMP;
  }
}

export class Assignment {
  courseSiteInfo: CourseSiteInfo;
  assignmentEntries: Array<AssignmentEntry>;
  isRead: boolean;

  constructor(courseSiteInfo: CourseSiteInfo, assignmentEntries: Array<AssignmentEntry>, isRead: boolean) {
    this.courseSiteInfo = courseSiteInfo;
    this.assignmentEntries = assignmentEntries;
    this.isRead = isRead;
  }

  get closestDueDateTimestamp(): number {
    if (this.assignmentEntries.length == 0) return -1;
    let min = MAX_TIMESTAMP;
    for (const entry of this.assignmentEntries) {
      if (min > entry.getDueDateTimestamp && entry.getDueDateTimestamp * 1000 >= nowTime) {
        min = entry.getDueDateTimestamp;
      }
    }
    if (min === MAX_TIMESTAMP) min = -1;
    return min;
  }

  // 完了済み以外からclosestTimeを取得する
  get closestDueDateTimestampExcludeFinished(): number {
    if (this.assignmentEntries.length == 0) return -1;
    let min = MAX_TIMESTAMP;
    let excludeCount = 0;
    for (const entry of this.assignmentEntries) {
      if (entry.isFinished) {
        excludeCount++;
        continue;
      }
      if (min > entry.getDueDateTimestamp && entry.getDueDateTimestamp * 1000 >= nowTime) {
        min = entry.getDueDateTimestamp;
      }
    }
    if (excludeCount === this.assignmentEntries.length) min = -1;
    if (min === MAX_TIMESTAMP) min = -1;
    return min;
  }

  getTopSite(): string {
    for (const entry of this.assignmentEntries) {
      if (entry.assignmentPage != null) return entry.assignmentPage;
    }
    return "";
  }
}

export class CourseSiteInfo {
  courseID: string;
  courseName: string | undefined;
  constructor(courseID: string, courseName: string | undefined) {
    this.courseID = courseID;
    this.courseName = courseName;
  }
}

export class DisplayAssignmentEntry extends AssignmentEntry {
  courseID: string;
  constructor(
    courseID: string,
    assignmentID: string,
    assignmentTitle: string,
    dueDateTimestamp: number | null,
    closeDateTimestamp: number | null,
    isFinished: boolean,
    isQuiz: boolean,
    isMemo: boolean
  ) {
    super(assignmentID, assignmentTitle, dueDateTimestamp, closeDateTimestamp, isMemo, isFinished, isQuiz);
    this.courseID = courseID;
  }

  private getTimeRemain(remainTimestamp: number): [string, string, string] {
    const day = Math.floor(remainTimestamp / (3600 * 24));
    const hours = Math.floor((remainTimestamp - day * 3600 * 24) / 3600);
    const minutes = Math.floor((remainTimestamp - (day * 3600 * 24 + hours * 3600)) / 60);
    return [day.toString(), hours.toString(), minutes.toString()];
  }

  get remainTimeString(): string {
    const timestamp = this.dueDateTimestamp;
    if (!timestamp) return chrome.i18n.getMessage("due_not_set");
    const timeRemain = this.getTimeRemain((timestamp * 1000 - nowTime) / 1000);
    return chrome.i18n.getMessage("remain_time", [timeRemain[0], timeRemain[1], timeRemain[2]]);
  }

  get remainCloseTimeString(): string {
    const timestamp = this.closeDateTimestamp;
    if (!timestamp) return chrome.i18n.getMessage("due_not_set");
    const timeRemain = this.getTimeRemain((timestamp * 1000 - nowTime) / 1000);
    return chrome.i18n.getMessage("remain_time", [timeRemain[0], timeRemain[1], timeRemain[2]]);
  }

  get dueDateString(): string {
    const timestamp = this.dueDateTimestamp;
    if (!timestamp) return "----/--/--";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + " " + date.getHours() + ":" + ("00" + date.getMinutes()).slice(-2);
  }

  get dueCloseDateString(): string {
    const timestamp = this.closeDateTimestamp;
    if (!timestamp) return "----/--/--";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + " " + date.getHours() + ":" + ("00" + date.getMinutes()).slice(-2);
  }
}

export class DisplayAssignment {
  assignmentEntries: Array<DisplayAssignmentEntry>;
  courseName: string | undefined;
  coursePage: string;
  constructor(assignmentEntries: Array<DisplayAssignmentEntry>, courseName: string | undefined, coursePage: string) {
    this.assignmentEntries = assignmentEntries;
    this.courseName = courseName;
    this.coursePage = coursePage;
  }
}
