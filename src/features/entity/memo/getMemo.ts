import { Memo } from "./types";
import { decodeMemoFromArray } from "./decode";
import { fromStorage } from "../../storage";
import { MemosStorage } from "../../../constant";

export const getStoredMemos = (hostname: string): Promise<Array<Memo>> => {
    return fromStorage<Array<Memo>>(hostname, MemosStorage, decodeMemoFromArray);
};

export const getMemos = async (hostname: string): Promise<Array<Memo>> => {
    return await getStoredMemos(hostname);
};
