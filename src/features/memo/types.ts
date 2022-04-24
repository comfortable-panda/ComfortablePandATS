export type MemoEntry = {
  id: string;
  title: string;
  dueTime: number | null;
  hasFinished: boolean;
};

export type Memo = {
  courseSite: null; //TODO: 型を定義する
  entries: Array<MemoEntry>;
  isRead: boolean;
};
