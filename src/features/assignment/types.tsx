import React, { ReactNode, useRef } from "react";
import { IEntity, IEntry } from "../../minisakai";
import { nowTime } from "../../utils";
import { Course } from "../course/types";

export class AssignmentEntry implements IEntry {
  constructor(public id: string, public title: string, public dueTime: number, public closeTime: number, public hasFinished: boolean) {
  }

  getDueDate(): number {
    return this.dueTime;
  }

  private static getTimeRemain(remainTimestamp: number): [string, string, string] {
    const day = Math.floor(remainTimestamp / (3600 * 24));
    const hours = Math.floor((remainTimestamp - day * 3600 * 24) / 3600);
    const minutes = Math.floor((remainTimestamp - (day * 3600 * 24 + hours * 3600)) / 60);
    return [day.toString(), hours.toString(), minutes.toString()];
  }
};

export class Assignment implements IEntity {
  constructor(public course: Course, public entries: Array<AssignmentEntry>, public isRead: boolean) { }

  getCourse(): Course {
    return this.course;
  }
};