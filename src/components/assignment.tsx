import { AssignmentEntry } from "../features/entity/assignment/types";
import { useTranslationArgsDeps } from "./helper";
import React, { useId } from "react";
import { createDateString, getRemainTimeString } from "../utils";
import { CurrentTime } from "../constant";

export default function AssignmentEntryView(props: {
    assignment: AssignmentEntry;
    isSubset: boolean;
    onCheck: (checked: boolean) => void;
}) {
    const dueDateString = createDateString(props.assignment.dueTime);
    const timeRemain = getRemainTimeString(props.assignment.dueTime - CurrentTime);
    const remainTimeString = useTranslationArgsDeps(
        "remain_time",
        [timeRemain[0], timeRemain[1], timeRemain[2]],
        timeRemain
    );

    const labelId = useId();

    return (
        <>
            {!props.isSubset ? (
                <>
                    <input
                        id={labelId}
                        className="cs-checkbox"
                        type="checkbox"
                        checked={props.assignment.hasFinished}
                        onChange={(ev) => props.onCheck(ev.target.checked)}
                    ></input>
                    <label htmlFor={labelId}></label>
                    <p className="cs-assignment-date">{dueDateString}</p>
                </>
            ) : (
                <span className="cs-assignment-date cs-assignmate-date-padding">{dueDateString}</span>
            )}
            <span className="cs-assignment-time-remain">{remainTimeString}</span>

            <p className="cs-assignment-title">{props.assignment.title}</p>
        </>
    );
}
