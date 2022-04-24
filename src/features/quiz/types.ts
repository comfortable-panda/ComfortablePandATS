import { Renderable } from "../../minisakai";
import { Course } from "../course/types";

export class QuizEntry implements Renderable {
  constructor(public id: string, public title: string, public dueTime: number | null, public hasFinished: boolean) { }

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
