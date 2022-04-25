import { Course } from "./types";
import { toStorage } from "../storage/save";

export const saveCourses = (hostname: string, courses: Array<Course>): Promise<string> => {
  return toStorage(hostname, "CS_CourseList", courses);
};
