import React from "react";
import { MemoEntry } from "../features/memo/types";
import { QuizEntry } from "../features/quiz/types";
import { useTranslation, useTranslationArgsDeps } from "./helper";

export default function MemoEntryView(props: {
    memo: MemoEntry
    isSubset: boolean
}) {
    const dueNotSet = useTranslation("due_not_set");
    // const timeRemain = AssignmentEntry.getTimeRemain((this.dueTime * 1000 - nowTime) / 1000);
    const timeRemain = [0, 0, 0]; // TODO
    const remainTime = useTranslationArgsDeps("remain_time", [timeRemain[0], timeRemain[1], timeRemain[2]], timeRemain);

    const dueDateString = remainTime;
    const remainTimeString = "TODO RemainTimeString"; // TODO

    const memoBadge = useTranslation('memo');

    return (
        <>
            {!props.isSubset ? (
                <>
                    <label>
                        {/* TODO: set oncheck handler */}
                        <input className="cs-checkbox" type="checkbox" checked={props.memo.hasFinished} readOnly={true}></input>
                    </label>
                    <p className="cs-assignment-date">{dueDateString}</p>
                </>
            ) : (
                <span className="cs-assignment-date cs-assignmate-date-padding">{dueDateString}</span>
            )}
            <span className="cs-assignment-time-remain">{remainTimeString}</span>

            <p className="cs-assignment-title">
                <span className="cs-badge cs-badge-memo">{memoBadge}</span>
                <span className="cs-del-memo-btn"></span> {/* TODO: del button */}
                {props.memo.title}
            </p>
        </>
    );
}
