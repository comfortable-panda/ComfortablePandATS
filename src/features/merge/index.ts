import { Assignment, AssignmentEntry } from "../assignment/types";
import { MemoEntry } from "../memo/types";

const getEntitiesMap = (entities: Array<Assignment>): Map<string, Assignment> => {
  return entities.reduce((map, entity) => {
    return map.set(entity.course.id, entity);
  }, new Map<string, Assignment>());
};

export const mergeAssignment = (oldEntities: Array<Assignment>, newEntities: Array<Assignment>): Array<Assignment> => {
  const arr: Array<Assignment> = [];
  const oldEntitiesMap = getEntitiesMap(oldEntities);
  const newEntitiesMap = getEntitiesMap(newEntities);
  newEntitiesMap.forEach((entity, id) => {
    const oldEntity = oldEntitiesMap.get(id);
    if (oldEntity !== undefined) {
      entity.entries = mergeAssignmentEntry(oldEntity.getEntriesMap(), entity.getEntriesMap());
      entity.isRead = oldEntity.isRead;
    }
    arr.push(entity);
  });
  return arr;
};

export const mergeAssignmentEntry = (oldEntryMap: Map<string, AssignmentEntry>, newEntryMap: Map<string, AssignmentEntry>): Array<AssignmentEntry> => {
  const arr: Array<AssignmentEntry> = [];
  newEntryMap.forEach((entry, id) => {
    const oldEntry = oldEntryMap.get(id);
    if (oldEntry !== undefined) {
      entry.hasFinished = oldEntry.hasFinished;
    }
    arr.push(entry);
  });
  return arr;
};

export const compareAndMergeAssignmentList = (oldAssignmentiList: Array<Assignment>, newAssignmentList: Array<Assignment>): Array<Assignment> => {
  const mergedAssignmentList = [];

  // Merge Assignments based on newAssignmentList
  for (const newAssignment of newAssignmentList) {
    const idx = oldAssignmentiList.findIndex((oldAssignment: Assignment) => {
      return oldAssignment.course.id === newAssignment.course.id;
    });

    // If this courseID is **NOT** in oldAssignmentList:
    if (idx === -1) {
      // Since this course site has a first assignment, set isRead flags to false.
      const isRead = newAssignment.entries.length === 0;

      // Sort and add this to AssignmentList
      newAssignment.entries.sort((a, b) => {
        return a.getDueDateTimestamp - b.getDueDateTimestamp;
      });
      mergedAssignmentList.push(new Assignment(newAssignment.course, newAssignment.entries, isRead));
    }

    // If this courseID **IS** in oldAssignmentList:
    else {
      // Take over isRead flag
      let isRead = oldAssignmentiList[idx].isRead;
      // Just in case if AssignmentList is empty, set flag to true
      if (newAssignment.entries.length === 0) isRead = true;

      const mergedAssignmentEntries: Array<AssignmentEntry> = [];
      for (const newAssignmentEntry of newAssignment.entries) {
        // Find if this new assignment is in old AssignmentList
        const oldAssignment = oldAssignmentiList[idx] as Assignment;
        const q = oldAssignment.entries.findIndex((oldAssignmentEntry) => {
          return oldAssignmentEntry.id === newAssignmentEntry.id;
        });
        // If there is same assignmentID, update it.
        if (q === -1) {
          // Set isRead flag to false since there might be some updates in assignment.
          isRead = false;
          mergedAssignmentEntries.push(newAssignmentEntry);
        }
        // If there is not, create a new AssignmentEntry for the course site.
        else {
          const entry = new AssignmentEntry(
            newAssignmentEntry.id,
            newAssignmentEntry.title,
            newAssignmentEntry.dueTime,
            newAssignmentEntry.closeTime,
            oldAssignment.entries[q].hasFinished,
          );
          mergedAssignmentEntries.push(entry);
        }
      }
      // Sort AssignmentList
      mergedAssignmentEntries.sort((a, b) => {
        return a.getDueDateTimestamp - b.getDueDateTimestamp;
      });
      mergedAssignmentList.push(new Assignment(newAssignment.course, mergedAssignmentEntries, isRead));
    }
  }
  return mergedAssignmentList;
};
