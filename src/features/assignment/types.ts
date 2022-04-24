export type Assignment = {
  courseID: string;
  id: string;
  title: string;
  dueTime: number | null;
  closeTime: number | null;
  hasFinished: boolean;
};
