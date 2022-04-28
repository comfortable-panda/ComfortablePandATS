import { Course } from "../course/types";
import { EntityProtocol, EntryProtocol } from "../entity/type";
import { saveMemoEntry } from "./saveMemo";

const MAX_TIMESTAMP = 99999999999999;
export class MemoEntry implements EntryProtocol {
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
    throw "aa";
  }

  save(hostname:string): Promise<void> {
      return saveMemoEntry(hostname, this);
  }
};


export class Memo implements EntityProtocol {
  readonly isRead = true;

  constructor(public course: Course, public entries: Array<MemoEntry>) { }
  getEntries(): MemoEntry[] {
    return this.entries;
  }
  getCourse(): Course {
    return this.course;
  }

  render(): [React.Component<{}, {}, any>, number][] {
    return this.entries.map(e => e.render()).reduce((acc, val) => acc.concat(val), []);
  }

  getEntriesMap(): Map<string, MemoEntry> {
    return this.entries.reduce((map, entry) => {
      return map.set(entry.id, entry);
    }, new Map<string, MemoEntry>());
  }
};
