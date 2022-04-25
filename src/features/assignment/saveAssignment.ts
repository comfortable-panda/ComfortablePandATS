import { Assignment } from "./types";
import { toStorage } from "../storage/save";

export const saveAssignments = (hostname: string, assignments: Array<Assignment>): Promise<string> => {
  return toStorage(hostname, "CS_AssignmentList", assignments);
};
