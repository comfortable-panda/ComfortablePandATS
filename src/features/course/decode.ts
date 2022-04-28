import { Course } from "./types";

export const decodeCourseFromArray = (data: Array<any>): Array<Course> => {
    const courses: Array<Course> = [];
    if (typeof data === "undefined") return courses;
    for (const course of data) {
        courses.push(new Course(course.id, course.name, course.link));
    }
    return courses;
};
