import { Course } from "../../course/types";
import { EntityProtocol, EntryProtocol } from "../type";
import { saveAssignmentEntry } from "./saveAssignment";
import { MaxTimestamp } from "../../../constant";


export class AssignmentEntry implements EntryProtocol {
    constructor(
        public id: string,
        public title: string,
        public dueTime: number,
        public closeTime: number,
        public hasFinished: boolean
    ) {}

    getTimestamp(showLateAcceptedEntry: boolean): number {
        return showLateAcceptedEntry ? this.getCloseDateTimestamp : this.getDueDateTimestamp;
    }

    get getDueDateTimestamp(): number {
        return this.dueTime ? this.dueTime : MaxTimestamp;
    }

    get getCloseDateTimestamp(): number {
        return this.closeTime ? this.closeTime : MaxTimestamp;
    }

    getID(): string {
        return this.id;
    }

    getDueDate(): number {
        return this.dueTime;
    }

    getCloseDate(): number {
        return this.closeTime;
    }

    save(hostname: string): Promise<void> {
        return saveAssignmentEntry(hostname, this);
    }
}

export class Assignment implements EntityProtocol {
    constructor(public course: Course, public entries: Array<AssignmentEntry>, public isRead: boolean) {}

    getEntries(): AssignmentEntry[] {
        return this.entries;
    }

    getCourse(): Course {
        return this.course;
    }

    getEntriesMap(): Map<string, AssignmentEntry> {
        return this.entries.reduce((map, entry) => {
            return map.set(entry.id, entry);
        }, new Map<string, AssignmentEntry>());
    }
}
