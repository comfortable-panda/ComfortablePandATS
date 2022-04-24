import { AssignmentEntry } from "./types";
import { nowTime } from "../../utils";

/* Sakai APIから取得した課題をAssignmentEntryに変換する */
export const toAssignments = (data: Record<string, any>): Array<AssignmentEntry> => {
  return data.sam_pub_collection
    .filter((json: any) => json.closeTime.epochSecond * 1000 >= nowTime)
    .map((json: any) => {
      const entry = new AssignmentEntry(
        json.id,
        json.title,
        json.dueTime.epochSecond ? json.dueTime.epochSecond : null,
        json.closeTime.epochSecond ? json.closeTime.epochSecond : null,
        false,
      );
      return entry;
    });
};
