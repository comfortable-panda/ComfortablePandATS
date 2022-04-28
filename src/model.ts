import { nowTime } from "./utils";


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
