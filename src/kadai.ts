class KadaiEntry {
  kadaiID: string;
  assignmentTitle: string;
  assignmentDetail?: string;
  dueDateTimestamp: number; // POSIX time
  isFinished: boolean;

  constructor(
    kadaiID: string,
    assignmentTitle: string,
    dueDateTimestamp: number,
    isFinished: boolean,
    assignmentDetail?: string
  ) {
    this.kadaiID = kadaiID;
    this.assignmentTitle = assignmentTitle;
    this.assignmentDetail = assignmentDetail;
    this.dueDateTimestamp = dueDateTimestamp;
    this.isFinished = isFinished;
  }
}

class Kadai {
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
    let min = this.kadaiEntries[0];
    for (const entry of this.kadaiEntries) {
      if (min > entry.dueDateTimestamp) {
        min = entry.dueDateTimestamp;
      }
    }
    return min;
  }
}
