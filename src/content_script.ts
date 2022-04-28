import { saveHostName } from "./storage";
import { Assignment, CourseSiteInfo } from "./model";
import { createMiniSakaiBtn, createMiniSakai, createFavoritesBarNotification } from "./minisakai";
import { addFavoritedCourseSites } from "./favorites";
import { isLoggedIn, updateIsReadFlag, miniSakaiReady } from "./utils";
import { loadConfigs } from "./settings";
import { Course } from "./features/course/types";
import { Assignment as NewAssignment, AssignmentEntry } from './features/assignment/types';
import { EntityUnion } from "./components/entryTab";
import { Quiz as NewQuiz } from "./features/quiz/types";
import { Memo as NewMemo } from "./features/memo/types";
import { getAssignments } from "./features/assignment/getAssignment";
import { getQuizzes } from "./features/quiz/getQuiz";
import { getMemos } from "./features/memo/getMemo";
import { getSakaiCourses } from "./features/course/getCourse";
import { fromStorage } from "./features/storage/load";

export let courseIDList: Array<CourseSiteInfo>;
export let mergedAssignmentListNoMemo: Array<Assignment>;

async function updateReadFlag() {
  const updatedAssignmentList = updateIsReadFlag(mergedAssignmentListNoMemo);
  // await saveToLocalStorage("CS_AssignmentList", updatedAssignmentList);
}

async function main() {
  if (isLoggedIn()) {
    createMiniSakaiBtn();
    const config = await loadConfigs();
    await addFavoritedCourseSites(config.baseURL);
    // displayMiniSakai(mergedAssignmentList, courseIDList);
    createMiniSakai();

    miniSakaiReady();
    await updateReadFlag();
    await saveHostName();
  }
}

main();

// async function getLastCache() {
//   const hostname = window.location.hostname;
//   const assignmentTime = await fromStorage<string>(hostname, "CS_AssignmentFetchTime", (time) => { return time as string });
//   const quizTime = await fromStorage<string>(hostname, "CS_QuizFetchTime", (time) => { return time as string });
//   return {
//     assignment: assignmentTime,
//     quiz: quizTime,
//   };
// }

// function getCourses(): Array<Course> {
//   return getSakaiCourses();
// }

// async function getEntities(courses: Array<Course>) {
//   const hostname = window.location.hostname;
//   // TODO: 並列化する
//   const assignment: Array<NewAssignment> = await getAssignments(hostname, courses, false);
//   const quiz: Array<NewQuiz> = await getQuizzes(hostname, courses, false);
//   const memo: Array<NewMemo> = await getMemos(hostname);
//   return {
//     assignment: assignment,
//     quiz: quiz,
//     memo: memo,
//   };
// }
