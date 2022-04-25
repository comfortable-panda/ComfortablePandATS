import { Renderable } from "../../minisakai";
import { Course } from "../course/types";

const MAX_TIMESTAMP = 99999999999999;
export class MemoEntry implements Renderable {
  constructor(public id: string, public title: string, public dueTime: number | null, public hasFinished: boolean) { }

  getTimestamp(): number {
    return this.getDueDateTimestamp;
  }

  get getDueDateTimestamp(): number {
    return this.dueTime ? this.dueTime : MAX_TIMESTAMP;
  }

  render(): [React.Component<{}, {}, any>, number][] {
    throw "aa";
  }
};

export class Memo implements Renderable {
  constructor(public course: Course, public entries: Array<MemoEntry>) { }

  render(): [React.Component<{}, {}, any>, number][] {
    return this.entries.map(e => e.render()).reduce((acc, val) => acc.concat(val), []);
  }
};
