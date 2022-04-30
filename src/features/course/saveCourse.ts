import { Course } from "./types";
import { toStorage } from "../storage";
import { CoursesStorage } from "../../constant";

export const saveCourses = (hostname: string, courses: Array<Course>): Promise<string> => {
    return toStorage(hostname, CoursesStorage, courses);
};
