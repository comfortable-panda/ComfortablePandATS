export class KadaiEntry {
  kadaiID: string;
  assignmentTitle: string;
  assignmentDetail?: string;
  dueDateTimestamp: number; // POSIX time
  isMemo: boolean;
  isFinished: boolean;
  kadaiPage?: string;
  isQuiz: boolean;

  constructor(
    kadaiID: string,
    assignmentTitle: string,
    dueDateTimestamp: number,
    isMemo: boolean,
    isFinished: boolean,
    isQuiz: boolean,
    assignmentDetail?: string
  ) {
    this.kadaiID = kadaiID;
    this.assignmentTitle = assignmentTitle;
    this.assignmentDetail = assignmentDetail;
    this.dueDateTimestamp = dueDateTimestamp;
    this.isMemo = isMemo;
    this.isFinished = isFinished;
    this.isQuiz = isQuiz;
  }
}

export class Kadai {
  lectureID: string;
  lectureName: string;
  kadaiEntries: Array<KadaiEntry>;
  isRead: boolean;

  constructor(
    lectureID: string,
    lectureName: string,
    kadaiEntries: Array<KadaiEntry>,
    isRead: boolean
  ) {
    this.lectureID = lectureID;
    this.lectureName = lectureName;
    this.kadaiEntries = kadaiEntries;
    this.isRead = isRead;
  }

  get closestDueDateTimestamp(): number {
    if (this.kadaiEntries.length == 0) return -1;
    let min = this.kadaiEntries[0].dueDateTimestamp;
    for (const entry of this.kadaiEntries) {
      if (min > entry.dueDateTimestamp) {
        min = entry.dueDateTimestamp;
      }
    }
    return min;
  }

  // 完了済み以外からclosestTimeを取得する
  get closestDueDateTimestampExcludeFinished(): number {
    if (this.kadaiEntries.length == 0) return -1;
    let min = 99999999999999;
    let excludeCount = 0;
    for (const entry of this.kadaiEntries) {
      if (entry.isFinished) {
        excludeCount++;
        continue;
      }
      if (min > entry.dueDateTimestamp) {
        min = entry.dueDateTimestamp;
      }
    }
    if (excludeCount === this.kadaiEntries.length) min = -1;
    if (min === 99999999999999) min = -1;
    return min;
  }

  getTopSite(): string | null {
    for (const entry of this.kadaiEntries) {
      if (entry.kadaiPage != null) return entry.kadaiPage;
    }
    return null;
  }
}

export class LectureInfo {
  tabType: string;
  lectureID: string;
  lectureName: string;
  constructor(
    tabType: string,
    lectureID: string,
    lectureName: string
  ) {
    this.tabType = tabType;
    this.lectureID = lectureID;
    this.lectureName = lectureName;
  }
}
