import { IEntity, IEntry } from "../../minisakai";
import { Course } from "../course/types";

export class MemoEntry implements IEntry {
  constructor(public id: string, public title: string, public dueTime: number, public hasFinished: boolean) { }
  getDueDate(): number {
    return this.dueTime;
  }

  render(): [React.Component<{}, {}, any>, number][] {
    throw "aa";
  }
};

export class Memo implements IEntity {
  constructor(public course: Course, public entries: Array<MemoEntry>, public isRead: boolean) { }
  getCourse(): Course {
    return this.course;
  }

  render(): [React.Component<{}, {}, any>, number][] {
    return this.entries.map(e => e.render()).reduce((acc, val) => acc.concat(val), []);
  }
};
