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

export class QuizEntry {
  id: string;
  ownerSite: {
    id: string;
    name: string;
  };
  title: string;
  dueDateTimestamp: number;
  startDateTimestamp: number;

  constructor(
    id: string,
    title: string,
    startDateTimestamp: number,
    dueDateTimestamp: number,
    ownerSiteId: string,
    ownerSiteName: string
  ) {
    this.id = id;
    this.title = title;
    this.startDateTimestamp = startDateTimestamp;
    this.dueDateTimestamp = dueDateTimestamp;
    this.ownerSite = {
      id: ownerSiteId,
      name: ownerSiteName
    };
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

  getTopSite(): string | null {
    for (const entry of this.kadaiEntries) {
      if (entry.kadaiPage != null) return entry.kadaiPage;
    }
    return null;
  }
}

export class Quiz {
  lectureID: string;
  lectureName: string;
  quizEntries: Array<QuizEntry>;
  isRead: boolean;

  constructor(
    lectureID: string,
    lectureName: string,
    quizEntries: Array<QuizEntry>,
    isRead: boolean
  ) {
    this.lectureID = lectureID;
    this.lectureName = lectureName;
    this.quizEntries = quizEntries;
    this.isRead = isRead;
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
