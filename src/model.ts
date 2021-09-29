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

  getTopSite(): string | null {
    for (const entry of this.assignmentEntries) {
      if (entry.assignmentPage != null) return entry.assignmentPage;
    }
    return null;
  }
}

export class CourseSiteInfo {
  courseID: string;
  courseName: string;
  constructor(
    courseID: string,
    courseName: string
  ) {
    this.courseID = courseID;
    this.courseName = courseName;
  }
}
