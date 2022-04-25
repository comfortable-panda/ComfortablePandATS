import { Renderable } from "../../minisakai";
import { Course } from "../course/types";

const MAX_TIMESTAMP = 99999999999999;
export class AssignmentEntry implements Renderable {
  constructor(public id: string, public title: string, public dueTime: number | null, public closeTime: number | null, public hasFinished: boolean) {
  }

  getTimestamp(showLateAcceptedEntry: boolean): number {
    return showLateAcceptedEntry ? this.getCloseDateTimestamp : this.getDueDateTimestamp;
  }

  get getDueDateTimestamp(): number {
    return this.dueTime ? this.dueTime : MAX_TIMESTAMP;
  }

  get getCloseDateTimestamp(): number {
    return this.closeTime ? this.closeTime : MAX_TIMESTAMP;
  }

  render(): [React.Component<{}, {}, any>, number][] {
    throw "not yet implemented";
  }
};

export class Assignment implements Renderable {
  constructor(public course: Course, public entries: Array<AssignmentEntry>, public isRead: boolean) { }

  render(): [React.Component<{}, {}, any>, number][] {
    return this.entries.map(e => e.render()).reduce((acc, val) => acc.concat(val), []);
  }
};
