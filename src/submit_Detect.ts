import {getStoredAssignments} from "./features/entity/assignment/getAssignment";
import {saveAssignmentEntry} from "./features/entity/assignment/saveAssignment";
import { AssignmentEntry } from "./features/entity/assignment/types";

const submitDetect = (hostname: string) => {
  const postButton = document.querySelector("[name='post']");

  if (!postButton) {
    return;
  }

  if (postButton.hasAttribute("watch")) {
    return;
  }

  const get_assignment = (document.querySelector("#addSubmissionForm > [name=\"assignmentId\"]") as HTMLInputElement).value;
  
  postButton.addEventListener("click", () => { postButton.setAttribute("watch", true.toString()); });
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