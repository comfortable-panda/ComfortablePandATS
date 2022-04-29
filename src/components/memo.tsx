import React, { useId } from "react";
import { MemoEntry } from "../features/entity/memo/types";
import { useTranslation, useTranslationArgsDeps } from "./helper";

export default function MemoEntryView(props: {
    memo: MemoEntry;
    isSubset: boolean;
    onCheck: (checked: boolean) => void;
    onDelete: () => void;
}) {
    // const timeRemain = AssignmentEntry.getTimeRemain((this.dueTime * 1000 - nowTime) / 1000);
    const timeRemain = [0, 0, 0]; // TODO
    const remainTime = useTranslationArgsDeps("remain_time", [timeRemain[0], timeRemain[1], timeRemain[2]], timeRemain);

    const dueDateString = remainTime;
    const remainTimeString = "TODO RemainTimeString"; // TODO

    const memoBadge = useTranslation("memo");

    const labelId = useId();

    return (
        <>
            {!props.isSubset ? (
                <>
                    <input
                        id={labelId}
                        className="cs-checkbox"
                        type="checkbox"
                        checked={props.memo.hasFinished}
                        onChange={(ev) => props.onCheck(ev.target.checked)}
                    ></input>
                    <label htmlFor={labelId}></label>
                    <p className="cs-assignment-date">{dueDateString}</p>
                </>
            ) : (
                <span className="cs-assignment-date cs-assignmate-date-padding">{dueDateString}</span>
            )}
            <span className="cs-assignment-time-remain">{remainTimeString}</span>

            <p className="cs-assignment-title">
                <span className="cs-badge cs-badge-memo">{memoBadge}</span>
                <span className="cs-del-memo-btn" onClick={() => props.onDelete()}>x</span> {/* TODO: del button */}
                {props.memo.title}
            </p>
        </>
    );
}
