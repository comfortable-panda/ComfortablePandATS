import { Memo, MemoEntry } from "./types";
import { toStorage } from "../storage/save";
import { decodeMemoFromArray } from "./decode";
import { fromStorage } from "../storage/load";

export const saveMemos = (hostname: string, memos: Array<Memo>): Promise<string> => {
  return toStorage(hostname, "CS_MemoList", memos);
};

export const saveMemoEntry = async (hostname: string, changedEntry: MemoEntry) => {
  const memos = await fromStorage(hostname, "CS_MemoList", decodeMemoFromArray);
  LOOP:
  for (const memo of memos) {
    const entries = memo.getEntries();
    for (let i=0;i<entries.length;i++) {
      if (entries[i].id === changedEntry.id) {
        entries[i]=changedEntry;
        break LOOP;
      }
    }
  }
  await saveMemos(hostname, memos);
};
