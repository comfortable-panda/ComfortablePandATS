import { Renderable } from "../../minisakai";
import { Course } from "../course/types";

export class MemoEntry implements Renderable {
  constructor(public id: string, public title: string, public dueTime: number | null, public hasFinished: boolean) { }

  render(): [React.Component<{}, {}, any>, number][] {
    throw "aa";
  }
};

export class Memo implements Renderable {
  constructor(public course: Course, public entries: Array<MemoEntry>, public isRead: boolean) { }

  render(): [React.Component<{}, {}, any>, number][] {
    return this.entries.map(e => e.render()).reduce((acc, val) => acc.concat(val), []);
  }
};
