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
