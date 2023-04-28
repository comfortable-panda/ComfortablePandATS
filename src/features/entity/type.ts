import { Course } from "../course/types";

export interface EntityProtocol {
    course: Course;
    entries: Array<EntryProtocol>;
    isRead: boolean;

    getCourse(): Course;

    getEntriesMap(): Map<string, EntryProtocol>;
}

export interface EntryProtocol {
    id: string;
    title: string;
    dueTime: number;
    hasFinished: boolean;
    hidden?: boolean;

    getTimestamp(currentTime: number, showLateAcceptedEntry: boolean): number;

    getDueDate(showLate: boolean): number;

    getCloseDate(): number;

    getID(): string;

    isHidden(): boolean;

    save(hostname: string): Promise<void>;
}
