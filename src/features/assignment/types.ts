import { Renderable } from "../../minisakai";
import { Course } from "../course/types";

export class AssignmentEntry implements Renderable {
  constructor(public id: string, public title: string, public dueTime: number|null, public closeTime: number|null, public hasFinished:boolean) {
  }

  render(): [React.Component<{}, {}, any>, number][] {
      throw "not yet implemented";
  }
};

export class Assignment implements Renderable {
  constructor(public course: Course, public entries:Array<AssignmentEntry>, public isRead:boolean) {}

  render(): [React.Component<{}, {}, any>, number][] {
    return this.entries.map(e => e.render()).reduce((acc, val) => acc.concat(val), []);
  }
};
