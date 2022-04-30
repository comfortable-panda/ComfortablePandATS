import React, { useId } from "react";
import { QuizEntry } from "../features/entity/quiz/types";
import { createDateString, getRemainTimeString } from "../utils";
import { useTranslation } from "./helper";

export default function QuizEntryView(props: {
    quiz: QuizEntry;
    isSubset: boolean;
    onCheck: (checked: boolean) => void;
}) {
    const dueDateString = createDateString(props.quiz.dueTime);
    const remainTimeString = getRemainTimeString(props.quiz.dueTime);

    const quizBadge = useTranslation("quiz");

    const labelId = useId();

    return (
        <>
            {!props.isSubset ? (
                <>
                    <input
                        id={labelId}
                        className="cs-checkbox"
                        type="checkbox"
                        checked={props.quiz.hasFinished}
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
                <span className="cs-badge cs-badge-quiz">{quizBadge}</span>
                {props.quiz.title}
            </p>
        </>
    );
}
