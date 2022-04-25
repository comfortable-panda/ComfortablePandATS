import { Memo } from "./types";
import { decodeMemoFromArray } from "./decode";
import { fromStorage } from "../storage/load";

export const getStoredMemos = (hostname: string): Promise<Array<Memo>> => {
  return fromStorage<Array<Memo>>(hostname, "CS_MemoList", decodeMemoFromArray);
};
