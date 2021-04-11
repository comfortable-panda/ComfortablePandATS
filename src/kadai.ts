export class KadaiEntry {
  kadaiID: string;
  assignmentTitle: string;
  assignmentDetail?: string;
  dueDateTimestamp: number; // POSIX time
  isMemo: boolean;
  isFinished: boolean;

  constructor(
    kadaiID: string,
    assignmentTitle: string,
    dueDateTimestamp: number,
    isMemo: boolean,
    isFinished: boolean,
    assignmentDetail?: string
  ) {
    this.kadaiID = kadaiID;
    this.assignmentTitle = assignmentTitle;
    this.assignmentDetail = assignmentDetail;
    this.dueDateTimestamp = dueDateTimestamp;
    this.isMemo = isMemo;
    this.isFinished = isFinished;
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
