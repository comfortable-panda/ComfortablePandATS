import { Course } from "./types";
import { decodeCourseFromArray } from "./decode";
import { fetchCourse } from "../api/fetch";
import { fromStorage } from "../storage";
import { CoursesStorage } from "../../constant";

export const getSakaiCourses = (): Array<Course> => {
    return fetchCourse();
};

export const getStoredCourses = (hostname: string): Promise<Array<Course>> => {
    return fromStorage<Array<Course>>(hostname, CoursesStorage, decodeCourseFromArray);
};
