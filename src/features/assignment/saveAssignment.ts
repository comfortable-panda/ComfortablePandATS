import { Assignment, AssignmentEntry } from "./types";
import { toStorage } from "../storage/save";
import { fromStorage } from "../storage/load";
import { decodeAssignmentFromArray } from "./decode";

export const saveAssignments = (hostname: string, assignments: Array<Assignment>): Promise<string> => {
  return toStorage(hostname, "CS_AssignmentList", assignments);
};

export const saveAssignmentEntry = async (hostname: string, changedEntry: AssignmentEntry) => {
  const assignments = await fromStorage(hostname, "CS_AssignmentList", decodeAssignmentFromArray);
  LOOP:
  for (const assignment of assignments) {
    const entries = assignment.getEntries();
    for (let i=0;i<entries.length;i++) {
      if (entries[i].id === changedEntry.id) {
        entries[i]=changedEntry;
        break LOOP;
      }
    }
  }
  saveAssignments(hostname, assignments);
}
