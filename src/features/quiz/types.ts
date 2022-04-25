import { Renderable } from "../../minisakai";
import { Course } from "../course/types";

const MAX_TIMESTAMP = 99999999999999;
export class QuizEntry implements Renderable {
  constructor(public id: string, public title: string, public dueTime: number | null, public hasFinished: boolean) { }

  get getDueDateTimestamp(): number {
    return this.dueTime ? this.dueTime : MAX_TIMESTAMP;
  }

  render(): [React.Component<{}, {}, any>, number][] {
    throw "aaa";
  }
};

export class Quiz implements Renderable {
  constructor(public course: Course, public entries: Array<QuizEntry>, public isRead: boolean) { }

  render(): [React.Component<{}, {}, any>, number][] {
    return this.entries.map(e => e.render()).reduce((acc, val) => acc.concat(val), []);
  }
};
