import { AssignmentEntry } from "../features/assignment/types";
import { useTranslation, useTranslationArgsDeps } from "./helper";
import React, { useId } from 'react';

export default function AssignmentEntryView(props: {
    assignment: AssignmentEntry,
    isSubset: boolean,
    onCheck: (checked: boolean) => void
}) {
    const dueNotSet = useTranslation("due_not_set");
    // const timeRemain = AssignmentEntry.getTimeRemain((this.dueTime * 1000 - nowTime) / 1000);
    const timeRemain = [0, 0, 0]; // TODO
    const remainTime = useTranslationArgsDeps("remain_time", [timeRemain[0], timeRemain[1], timeRemain[2]], timeRemain);

    const dueDateString = remainTime;
    const remainTimeString = "TODO RemainTimeString"; // TODO

    const labelId = useId();

    return (
        <>
            {!props.isSubset ? (
                <>
                    <input id={labelId} className="cs-checkbox" type="checkbox" checked={props.assignment.hasFinished} onChange={(ev)=>props.onCheck(ev.target.checked)}></input>
                    <label htmlFor={labelId}></label>
                    <p className="cs-assignment-date">{dueDateString}</p>
                </>
            ) : (
                <span className="cs-assignment-date cs-assignmate-date-padding">{dueDateString}</span>
            )}
            <span className="cs-assignment-time-remain">{remainTimeString}</span>

            <p className="cs-assignment-title">
                {props.assignment.title}
            </p>
        </>
    );
}
