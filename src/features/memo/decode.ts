import { Memo, MemoEntry } from "./types";
import { Course } from "../course/types";
import { nowTime } from "../../utils";

export const decodeMemoFromArray = (data: Array<any>): Array<Memo> => {
    const memos: Array<Memo> = [];
    if (typeof data === "undefined") return memos;
    for (const memo of data) {
        const course: Course = new Course(memo.course.id, memo.course.name, memo.course.link);
        const entries: Array<MemoEntry> = [];
        for (const e of memo.entries) {
            const entry = new MemoEntry(e.id, e.title, e.dueTime, e.hasFinished);
            if (entry.getDueDateTimestamp * 1000 > nowTime) entries.push(entry);
        }
        memos.push(new Memo(course, entries));
    }
    return memos;
};
