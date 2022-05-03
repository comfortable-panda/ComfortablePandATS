import React, { useId } from "react";
import { MemoEntry } from "../features/entity/memo/types";
import { createDateString, getRemainTimeString } from "../utils";
import { useTranslation } from "./helper";

export default function MemoEntryView(props: {
    memo: MemoEntry;
    isSubset: boolean;
    onCheck: (checked: boolean) => void;
    onDelete: () => void;
}) {
    const dueDateString = createDateString(props.memo.dueTime);
    const remainTimeString = getRemainTimeString(props.memo.dueTime);

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
                <a onClick={() => props.onDelete()}>
                    <img src={chrome.runtime.getURL("img/closeBtn.svg")} alt="delete memo" className="cs-del-memo-btn" />
                </a>
                {props.memo.title}
            </p>
        </>
    );
}
