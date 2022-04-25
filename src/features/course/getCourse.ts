import { Course } from "./types";
import { fetchCourse } from "../api/fetch";

export const getSakaiCourses = (): Array<Course> => {
  return fetchCourse();
};
