import React, { useMemo, useState } from "react";
import { Assignment, AssignmentEntry } from "../features/assignment/types";
import { Course } from "../features/course/types";
import { Memo, MemoEntry } from "../features/memo/types";
import { Quiz, QuizEntry } from "../features/quiz/types";
import { CourseSiteInfo } from "../model";
import { getDaysUntil, nowTime } from "../utils";
import AssignmentEntryView from "./assignment";
import { useTranslation } from "./helper";
import MemoEntryView from "./memo";
import QuizEntryView from "./quiz";

// Every type in EntityUnion must implement IEntity
export type EntityUnion = Assignment | Quiz | Memo;
// Every type in EntryUnion must implement IEntry
export type EntryUnion = AssignmentEntry | QuizEntry | MemoEntry; // TODO: add Quiz, Memo, ...

export type DueType = 'danger' | 'warning' | 'success' | 'other';

function MiniSakaiCourse(props: {
    courseID: string,
    coursePage: string,
    courseName: string,
    entries: EntryUnion[],
    dueType: DueType,
    isSubset: boolean,
    onCheck: (entryId: string, checked: boolean) => void
}) {
    const divClass = useMemo(() => `cs-assignment-${props.dueType}`, [props.dueType]);
    const aClass = useMemo(() => `cs-course-${props.dueType} cs-course-name`, [props.dueType]);

    const elements = useMemo(() => {
        const elems: JSX.Element[] = [];
        for (const entry of props.entries) {
            if (entry instanceof AssignmentEntry) {
                elems.push(
                    <AssignmentEntryView key={entry.getID()} isSubset={props.isSubset} assignment={entry} onCheck={(checked) => props.onCheck(entry.getID(), checked)} />
                );
            } else if (entry instanceof QuizEntry) {
                elems.push(
                    <QuizEntryView key={entry.getID()} isSubset={props.isSubset} quiz={entry} onCheck={(checked) => props.onCheck(entry.getID(), checked)} />
                );
            } else if (entry instanceof MemoEntry) {
                elems.push(
                    <MemoEntryView key={entry.getID()} isSubset={props.isSubset} memo={entry} onCheck={(checked) => props.onCheck(entry.getID(), checked)} />
                );
            }
        }
        return elems;
    }, [props.entries]);

    return (
        // TODO: style
        <div className={divClass}>
            <a className={aClass} href={props.coursePage}>{props.courseName}</a>
            {elements}
        </div>
    );
}

export function EntryTab(props: {
    isSubset: boolean,
    showMemoBox: boolean,
    entities: EntityUnion[],
    onCheck: (entryId: string, checked: boolean) => void
}) {
    type EntryWithCourse = {
        entry: EntryUnion,
        course: Course
    };

    const dangerElements: EntryWithCourse[] = [];
    const warningElements: EntryWithCourse[] = [];
    const successElements: EntryWithCourse[] = [];
    const otherElements: EntryWithCourse[] = [];
    const lateElements: EntryWithCourse[] = [];

    for (const entity of props.entities) {
        const course = entity.getCourse();
        for (const entry of entity.entries) {
            const daysUntilDue = getDaysUntil(nowTime, entry.getDueDate() * 1000);

            switch (daysUntilDue) {
                case 'due24h':
                    dangerElements.push({
                        entry: entry,
                        course: course
                    });
                    break;
                case 'due5d':
                    warningElements.push({
                        entry: entry,
                        course: course
                    });
                    break;
                case 'due14d':
                    successElements.push({
                        entry: entry,
                        course: course
                    });
                    break;
                case 'dueOver14d':
                    otherElements.push({
                        entry: entry,
                        course: course
                    });
                    break;
                case 'duePassed':
                    lateElements.push({
                        entry: entry,
                        course: course
                    });
                    break;
            }
        }
    }

    return (
        <>
            <AddMemoBox shown={!props.isSubset && props.showMemoBox} courseSites={[]} />
            {dangerElements.length === 0 ? null : (
                <MiniSakaiEntryList
                    dueType="danger"
                    isSubset={props.isSubset}
                    entriesWithCourse={dangerElements}
                    onCheck={props.onCheck} />
            )}
            {warningElements.length === 0 ? null : (
                <MiniSakaiEntryList
                    dueType="warning"
                    isSubset={props.isSubset}
                    entriesWithCourse={warningElements}
                    onCheck={props.onCheck} />
            )}
            {successElements.length === 0 ? null : (
                <MiniSakaiEntryList
                    dueType="success"
                    isSubset={props.isSubset}
                    entriesWithCourse={successElements}
                    onCheck={props.onCheck} />
            )}
            {otherElements.length === 0 ? null : (
                <MiniSakaiEntryList
                    dueType="other"
                    isSubset={props.isSubset}
                    entriesWithCourse={otherElements}
                    onCheck={props.onCheck} />
            )}
            {/* TODO: handle late submits */}
        </>
    );
}

// TODO
function AddMemoBox(props: {
    shown: boolean,
    courseSites: CourseSiteInfo[] // TODO: do not use CourseSiteInfo
}) {
    const courseName = useTranslation("todo_box_course_name");
    const memoLabel = useTranslation("todo_box_memo");
    const dueDate = useTranslation("todo_box_due_date");
    const addBtnLabel = useTranslation("todo_box_add");

    const [todoContent, setTodoContent] = useState("");
    const [todoDue, setTodoDue] = useState("");

    const options = useMemo(() => {
        return props.courseSites.map(site => {
            return <option value={site.courseID}>{site.courseName}</option>;
        });
    }, [props.courseSites]);

    if (!props.shown) {
        return <div></div>
    }

    return (
        <div className="cs-memo-box addMemoBox">
            <div className="cs-memo-item">
                <p>{courseName}</p>
                <label>
                    <select className="todoLecName">
                        {options}
                    </select>
                </label>
            </div>
            <div className="cs-memo-item">
                <p>{memoLabel}</p>
                <label>
                    <input type="text" className="todoContent"
                        value={todoContent}
                        onChange={(ev) => setTodoContent(ev.target.value)}
                    />
                </label>
            </div>
            <div className="cs-memo-item">
                <p>{dueDate}</p>
                <label>
                    <input type="datetime-local" className="todoDue"
                        value={todoDue}
                        onChange={(ev) => setTodoDue(ev.target.value)}
                    />
                </label>
            </div>
            <div className="cs-memo-item">
                <button type="submit" id="todo-add">{addBtnLabel}</button>
            </div>
        </div>
    );
}

function MiniSakaiEntryList(props: {
    dueType: DueType,
    entriesWithCourse: {
        entry: EntryUnion,
        course: Course
    }[],
    isSubset: boolean,
    onCheck: (entryId: string, checked: boolean) => void
}) {
    const className = useMemo(() => {
        const baseClass = 'cs-minisakai-list';
        const clazz = `cs-minisakai-list-${props.dueType}`;
        return `${baseClass} ${clazz}`;
    }, [props.dueType]);

    // group entries by course
    const courseIdMap = new Map<string, EntryUnion[]>(); // map courseID -> EntryUnions
    const courseNameMap = new Map<string, string>(); // map courseID -> courseName
    for (const ewc of props.entriesWithCourse) {
        let entries: EntryUnion[];
        const courseID = ewc.course.id;
        if (!courseIdMap.has(courseID)) {
            entries = [];
            courseIdMap.set(courseID, entries);
        } else {
            entries = courseIdMap.get(courseID)!;
        }
        entries.push(ewc.entry);
        courseNameMap.set(courseID, ewc.course.name ?? 'unknown course');
    }

    const courses: JSX.Element[] = [];
    for (const [courseID, entries] of courseIdMap.entries()) {
        const courseName = courseNameMap.get(courseID) ?? '<unknown>';
        courses.push(
            <MiniSakaiCourse
                key={courseID}
                courseID={courseID}
                courseName={courseName}
                coursePage={courseID} // TODO: change to coursePage
                isSubset={props.isSubset}
                dueType={props.dueType}
                entries={entries}
                onCheck={(entryId, checked) => props.onCheck(entryId, checked)}
            />
        );
    }

    return (
        <div className={className}>
            {courses}
        </div>
    );
}
