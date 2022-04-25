import { Memo } from "./types";
import { toStorage } from "../storage/save";

export const saveMemos = (hostname: string, memos: Array<Memo>): Promise<string> => {
  return toStorage(hostname, "CS_MemoList", memos);
};
