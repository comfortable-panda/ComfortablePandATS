import React, { useId } from "react";
import { CurrentTime } from "../constant";
import { QuizEntry } from "../features/entity/quiz/types";
import { createDateString, getRemainTimeString } from "../utils";
import { useTranslation, useTranslationArgsDeps } from "./helper";

export default function QuizEntryView(props: {
    quiz: QuizEntry;
    isSubset: boolean;
    onCheck: (checked: boolean) => void;
}) {
    const dueDateString = createDateString(props.quiz.dueTime);
    const timeRemain = getRemainTimeString(props.quiz.dueTime - CurrentTime);
    const remainTimeString = useTranslationArgsDeps(
        "remain_time",
        [timeRemain[0], timeRemain[1], timeRemain[2]],
        timeRemain
    );

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
