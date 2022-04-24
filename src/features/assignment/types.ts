export type AssignmentEntry = {
  id: string;
  title: string;
  dueTime: number | null;
  closeTime: number | null;
  hasFinished: boolean;
};

export type Assignment = {
  courseSite: null; //TODO: 型を定義する
  entries: Array<AssignmentEntry>;
  isRead: boolean;
};
