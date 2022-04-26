import React from "react";
import { QuizEntry } from "../features/quiz/types";
import { useTranslation, useTranslationArgsDeps } from "./helper";

export default function QuizEntryView(props: {
    quiz: QuizEntry,
    isSubset: boolean
}) {
    const dueNotSet = useTranslation("due_not_set");
    // const timeRemain = AssignmentEntry.getTimeRemain((this.dueTime * 1000 - nowTime) / 1000);
    const timeRemain = [0, 0, 0]; // TODO
    const remainTime = useTranslationArgsDeps("remain_time", [timeRemain[0], timeRemain[1], timeRemain[2]], timeRemain);

    const dueDateString = remainTime;
    const remainTimeString = "TODO RemainTimeString"; // TODO

    const quizBadge = useTranslation('quiz');

    return (
        <>
            {!props.isSubset ? (
                <>
                    <label>
                        {/* TODO: set oncheck handler */}
                        <input className="cs-checkbox" type="checkbox" checked={props.quiz.hasFinished} readOnly={true}></input>
                    </label>
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
