import { IEntity, IEntry } from "../../components/entryTab";
import { Course } from "../course/types";

const MAX_TIMESTAMP = 99999999999999;
export class QuizEntry implements IEntry {
  constructor(public id: string, public title: string, public dueTime: number | null, public hasFinished: boolean) { }
  getID(): string {
    return this.id;
  }
  getDueDate(): number {
    return this.dueTime ?? 9999999999999999;
  }

  getTimestamp(): number {
    return this.getDueDateTimestamp;
  }

  get getDueDateTimestamp(): number {
    return this.dueTime ? this.dueTime : MAX_TIMESTAMP;
  }

  render(): [React.Component<{}, {}, any>, number][] {
    throw "aaa";
  }
};

export class Quiz implements IEntity<QuizEntry> {
  constructor(public course: Course, public entries: Array<QuizEntry>, public isRead: boolean) { }
  getEntries(): QuizEntry[] {
    return this.entries;
  }
  getCourse(): Course {
    return this.course;
  }

  render(): [React.Component<{}, {}, any>, number][] {
    return this.entries.map(e => e.render()).reduce((acc, val) => acc.concat(val), []);
  }
};
