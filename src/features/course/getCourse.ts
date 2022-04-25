import { Course } from "./types";
import { fetchCourse } from "../api/fetch";
import { fromStorage } from "../storage/load";
import { decodeCourseFromArray } from "./decode";

export const getSakaiCourses = (): Array<Course> => {
  return fetchCourse();
};

export const getStoredCourses = (hostname: string): Promise<Array<Course>> => {
  return fromStorage<Array<Course>>(hostname, "CS_CourseList", decodeCourseFromArray);
};
