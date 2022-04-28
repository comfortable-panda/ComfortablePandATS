import { Quiz, QuizEntry } from "./types";
import { toStorage } from "../storage/save";
import { decodeQuizFromArray } from "./decode";
import { fromStorage } from "../storage/load";
import { QuizzesStorage } from "../../constant";

export const saveQuizzes = (hostname: string, quizzes: Array<Quiz>): Promise<string> => {
    return toStorage(hostname, QuizzesStorage, quizzes);
};

export const saveQuizEntry = async (hostname: string, changedEntry: QuizEntry) => {
    const quizzes = await fromStorage(hostname, QuizzesStorage, decodeQuizFromArray);
    LOOP:
        for (const quiz of quizzes) {
            const entries = quiz.getEntries();
            for (let i = 0; i < entries.length; i++) {
                if (entries[i].id === changedEntry.id) {
                    entries[i] = changedEntry;
                    break LOOP;
                }
            }
        }
    await saveQuizzes(hostname, quizzes);
};
