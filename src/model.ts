import { nowTime } from "./utils";

export class AssignmentEntry {
  assignmentID: string;
  assignmentTitle: string;
  assignmentDetail?: string;
  dueDateTimestamp: number; // POSIX time
  isMemo: boolean;
  isFinished: boolean;
  assignmentPage?: string;
  isQuiz: boolean;

  constructor(
    assignmentID: string,
    assignmentTitle: string,
    dueDateTimestamp: number,
    isMemo: boolean,
    isFinished: boolean,
    isQuiz: boolean,
    assignmentDetail?: string
  ) {
    this.assignmentID = assignmentID;
    this.assignmentTitle = assignmentTitle;
    this.assignmentDetail = assignmentDetail;
    this.dueDateTimestamp = dueDateTimestamp;
    this.isMemo = isMemo;
    this.isFinished = isFinished;
    this.isQuiz = isQuiz;
  }
}

export class Assignment {
  courseSiteInfo: CourseSiteInfo;
  assignmentEntries: Array<AssignmentEntry>;
  isRead: boolean;

  constructor(
    courseSiteInfo: CourseSiteInfo,
    assignmentEntries: Array<AssignmentEntry>,
    isRead: boolean
  ) {
    this.courseSiteInfo = courseSiteInfo;
    this.assignmentEntries = assignmentEntries;
    this.isRead = isRead;
  }

  get closestDueDateTimestamp(): number {
    if (this.assignmentEntries.length == 0) return -1;
    let min = this.assignmentEntries[0].dueDateTimestamp;
    for (const entry of this.assignmentEntries) {
      if (min > entry.dueDateTimestamp) {
        min = entry.dueDateTimestamp;
      }
    }
    return min;
  }

  // 完了済み以外からclosestTimeを取得する
  get closestDueDateTimestampExcludeFinished(): number {
    if (this.assignmentEntries.length == 0) return -1;
    let min = 99999999999999;
    let excludeCount = 0;
    for (const entry of this.assignmentEntries) {
      if (entry.isFinished) {
        excludeCount++;
        continue;
      }
      if (min > entry.dueDateTimestamp) {
        min = entry.dueDateTimestamp;
      }
    }
    if (excludeCount === this.assignmentEntries.length) min = -1;
    if (min === 99999999999999) min = -1;
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
  constructor(
    courseID: string,
    courseName: string | undefined
  ) {
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
    dueDateTimestamp: number,
    isFinished: boolean,
    isQuiz: boolean,
    isMemo: boolean
  ) {
    super(assignmentID, assignmentTitle, dueDateTimestamp, isMemo, isFinished, isQuiz);
    this.courseID = courseID;
  }

  private getTimeRemain(remainTimestamp: number): [number, number, number] {
    const day = Math.floor(remainTimestamp / (3600 * 24));
    const hours = Math.floor((remainTimestamp - day * 3600 * 24) / 3600);
    const minutes = Math.floor((remainTimestamp - (day * 3600 * 24 + hours * 3600)) / 60);
    return [day, hours, minutes];
  }

  get remainTimeString(): string {
    const timeRemain = this.getTimeRemain((this.dueDateTimestamp * 1000 - nowTime) / 1000);
    return `あと${timeRemain[0]}日${timeRemain[1]}時間${timeRemain[2]}分`;
  }

  get dueDateString(): string {
    const date = new Date(this.dueDateTimestamp * 1000);
    return date.toLocaleDateString() + " " + date.getHours() + ":" + ("00" + date.getMinutes()).slice(-2);
  }
}

export class DisplayAssignment {
  assignmentEntries: Array<DisplayAssignmentEntry>;
  courseName: string | undefined;
  coursePage: string;
  constructor(
    assignmentEntries: Array<DisplayAssignmentEntry>,
    courseName: string | undefined,
    coursePage: string
  ) {
    this.assignmentEntries = assignmentEntries;
    this.courseName = courseName;
    this.coursePage = coursePage;
  }
}
