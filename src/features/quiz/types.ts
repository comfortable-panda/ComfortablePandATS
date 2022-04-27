import { IEntity, IEntry } from "../../components/entryTab";
import { Course } from "../course/types";
import { EntityProtocol, EntryProtocol } from "../entity/type";

const MAX_TIMESTAMP = 99999999999999;
export class QuizEntry implements IEntry, EntryProtocol {
  constructor(public id: string, public title: string, public dueTime: number, public hasFinished: boolean) { }
  getID(): string {
    return this.id;
  }
  getDueDate(): number {
    return this.dueTime;
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

export class Quiz implements IEntity, EntityProtocol {
  constructor(public course: Course, public entries: Array<QuizEntry>, public isRead: boolean) { }
  getCourse(): Course {
    return this.course;
  }

  render(): [React.Component<{}, {}, any>, number][] {
    return this.entries.map(e => e.render()).reduce((acc, val) => acc.concat(val), []);
  }

  getEntriesMap(): Map<string, QuizEntry> {
    return this.entries.reduce((map, entry) => {
      return map.set(entry.id, entry);
    }, new Map<string, QuizEntry>());
  }
};
