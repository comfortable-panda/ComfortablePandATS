export type QuizEntry = {
  id: string;
  title: string;
  dueTime: number | null;
  hasFinished: boolean;
};

export type Quiz = {
  courseSite: null; //TODO: 型を定義する
  entries: Array<QuizEntry>;
  isRead: boolean;
};
