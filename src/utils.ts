import { FetchTime, Settings as NewSettings } from "./features/setting/types";
import { Course } from "./features/course/types";
import { Assignment as NewAssignment } from "./features/assignment/types";
import { Quiz as NewQuiz } from "./features/quiz/types";
import { Memo as NewMemo } from "./features/memo/types";
import { getAssignments } from "./features/assignment/getAssignment";
import { getQuizzes } from "./features/quiz/getQuiz";
import { getMemos } from "./features/memo/getMemo";
import { fromStorage } from "./features/storage";
import { getSakaiCourses } from "./features/course/getCourse";
import { AssignmentFetchTimeStorage, QuizFetchTimeStorage } from "./constant";
import { saveAssignments } from "./features/assignment/saveAssignment";

export const nowTime = new Date().getTime();
export type DueCategory = "due24h" | "due5d" | "due14d" | "dueOver14d" | "duePassed";

export async function getEntities(settings: NewSettings, courses: Array<Course>) {
    // TODO: 並列化する
    const hostname = settings.appInfo.hostname;
    const currentTime = settings.appInfo.currentTime;
    const fetchTime = await getFetchTime(hostname);
    const assignment: Array<NewAssignment> = await getAssignments(hostname, courses, shouldUseCache(fetchTime.assignment, currentTime, settings.cacheInterval.assignment));
    const quiz: Array<NewQuiz> = await getQuizzes(hostname, courses, shouldUseCache(fetchTime.quiz, currentTime, settings.cacheInterval.quiz));
    const memo: Array<NewMemo> = await getMemos(hostname);
    return {
        assignment: assignment,
        quiz: quiz,
        memo: memo
    };
}

const decodeTimestamp = (data: any): number | undefined => {
    if (data === undefined) return undefined;
    return data as number;
};

export const shouldUseCache = (fetchTime: number | undefined, currentTime: number, cacheInterval: number): boolean => {
    if (fetchTime === undefined) return false;
    return (currentTime - fetchTime) / 1000 <= cacheInterval;
};

export async function getFetchTime(hostname: string): Promise<FetchTime> {
    const assignmentTime = await fromStorage<number | undefined>(hostname, AssignmentFetchTimeStorage, decodeTimestamp);
    const quizTime = await fromStorage<number | undefined>(hostname, QuizFetchTimeStorage, decodeTimestamp);
    return {
        assignment: assignmentTime,
        quiz: quizTime
    };
}

export function getCourses(): Array<Course> {
    return getSakaiCourses();
}

/**
 * Calculate category of assignment due date
 * @param {number} dt1 standard time
 * @param {number} dt2 target time
 */
function getDaysUntil(dt1: number, dt2: number): DueCategory {
    let diff = (dt2 - dt1) / 1000;
    diff /= 3600 * 24;
    let category: DueCategory;
    if (diff > 0 && diff <= 1) {
        category = "due24h";
    } else if (diff > 1 && diff <= 5) {
        category = "due5d";
    } else if (diff > 5 && diff <= 14) {
        category = "due14d";
    } else if (diff > 14) {
        category = "dueOver14d";
    } else {
        category = "duePassed";
    }
    return category;
}

/**
 * Format timestamp for displaying
 * @param {number | undefined} timestamp
 */
function formatTimestamp(timestamp: number | undefined): string {
    if (timestamp === undefined) return "---";
    const date = new Date(timestamp);
    return (
        date.toLocaleDateString() +
        " " +
        date.getHours() +
        ":" +
        ("00" + date.getMinutes()).slice(-2) +
        ":" +
        ("00" + date.getSeconds()).slice(-2)
    );
}

export const getLoggedInInfoFromScript = (): Array<HTMLScriptElement> => {
    return Array.from(document.getElementsByTagName("script"));
};

/**
 * Check if user is loggend in to Sakai.
 */
function isLoggedIn(): boolean {
    const scripts = getLoggedInInfoFromScript();
    let loggedIn = false;
    for (const script of scripts) {
        if (script.text.match("\"loggedIn\": true")) loggedIn = true;
    }
    return loggedIn;
}

/**
 * Get courseID of current site.
 */
export const getCourseSiteID = (url: string): string | undefined => {
    let courseID: string | undefined;
    const reg = new RegExp("(https?://[^/]+)/portal/site/([^/]+)");
    if (url.match(reg)) {
        courseID = url.match(reg)?.[2];
    }
    return courseID;
};

export const updateIsReadFlag = (currentHref: string, assignments: Array<NewAssignment>) => {
    const courseID = getCourseSiteID(currentHref);
    if (courseID === undefined) return;
    for (const assignment of assignments) {
        if (assignment.course.id === courseID && assignment.entries.length > 0) {
            assignment.isRead = true;
            saveAssignments(window.location.hostname, assignments);
        }
    }
};

/**
 * Change loading icon to hamburger button.
 */
function miniSakaiReady(): void {
    const loadingIcon = document.getElementsByClassName("cs-loading")[0];
    const hamburgerIcon = document.createElement("img");
    hamburgerIcon.src = chrome.runtime.getURL("img/miniSakaiBtn.png");
    hamburgerIcon.className = "cs-minisakai-btn";
    loadingIcon.className = "cs-minisakai-btn-div";
    loadingIcon.append(hamburgerIcon);
}

/**
 * Get the current Sakai theme.
 * @returns 'light' or 'dark'. Returns null on failure.
 */
function getSakaiTheme(): "light" | "dark" | null {
    // Get the 'background-color' property of #topnav_container
    const topnavContainer = document.querySelector("#topnav_container");
    if (topnavContainer === null) {
        return null;
    }

    const color = window.getComputedStyle(topnavContainer).backgroundColor;
    if (!(color as any).startsWith("rgb")) {
        // backgroundColor is not defined properly
        return null;
    }

    if (color === "rgb(255, 255, 255)") {
        return "light";
    } else {
        return "dark";
    }
}

export {
    getDaysUntil,
    formatTimestamp,
    isLoggedIn,
    miniSakaiReady,
    getSakaiTheme
};
