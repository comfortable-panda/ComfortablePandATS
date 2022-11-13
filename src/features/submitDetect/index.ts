import {getStoredAssignments} from "../entity/assignment/getAssignment";
import {saveAssignmentEntry} from "../entity/assignment/saveAssignment";
import { AssignmentEntry } from "../entity/assignment/types";

const submitDetect = (hostname: string) => {
  const postButton = document.querySelector("[name='post']");

  if (!postButton) {
    return;
  }

  const get_assignment = (document.querySelector("#addSubmissionForm > [name=\"assignmentId\"]") as HTMLInputElement).value;
  
  postButton.addEventListener("click", async () => {
    const storedAssignments = await getStoredAssignments(hostname);

    const assignment_id = get_assignment.split("/").slice(-1)[0];
    const course_id = location.href.split("/")[5];

    const courseIndex = storedAssignments.findIndex(x => x.course.id === course_id);
    const assignmentEntry = storedAssignments[courseIndex].entries.find(x => x.id === assignment_id);
    
    if (assignmentEntry == null) {
      console.warn("Can't find assignment in storedAssignments")
      return
    }
    assignmentEntry.hasFinished = true;
    
    await saveAssignmentEntry(hostname, assignmentEntry);
  });
  
};

export default submitDetect;