import { Quiz } from "./types";
import { decodeQuizFromArray } from "./decode";
import { Course } from "../../course/types";
import { fetchQuiz } from "../../api/fetch";
import { toStorage, fromStorage } from "../../storage";
import { mergeEntities } from "../../merge";
import { QuizFetchTimeStorage, QuizzesStorage } from "../../../constant";

export const getSakaiQuizzes = async (hostname: string, courses: Array<Course>): Promise<Array<Quiz>> => {
    const quizzes: Array<Quiz> = [];
    const pending: Array<Promise<Quiz>> = [];
    for (const course of courses) {
        pending.push(fetchQuiz(course));
    }
    const result = await (Promise as any).allSettled(pending);
    for (const quiz of result) {
        if (quiz.status === "fulfilled") quizzes.push(quiz.value);
    }
    await toStorage(hostname, QuizFetchTimeStorage, new Date().getTime() / 1000);
    return quizzes;
};

export const getStoredQuizzes = (hostname: string): Promise<Array<Quiz>> => {
    return fromStorage<Array<Quiz>>(hostname, QuizzesStorage, decodeQuizFromArray);
};

export const getQuizzes = async (hostname: string, courses: Array<Course>, useCache: boolean): Promise<Array<Quiz>> => {
    const storedQuizzes = await getStoredQuizzes(hostname);
    // console.log("getQuiz, useCache:", useCache);
    if (useCache) return storedQuizzes;
    const sakaiQuizzes = await getSakaiQuizzes(hostname, courses);
    const merged = mergeEntities<Quiz>(storedQuizzes, sakaiQuizzes);
    await toStorage(hostname, QuizzesStorage, merged);
    return merged;
};
