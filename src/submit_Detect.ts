import {getStoredAssignments} from "./features/entity/assignment/getAssignment";
import {saveAssignmentEntry} from "./features/entity/assignment/saveAssignment";

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

    const assignmentIndex = storedAssignments.findIndex(x => x.course.id === course_id);
    const entryIndex = storedAssignments[assignmentIndex].entries.findIndex(x => x.id === assignment_id);
   
    storedAssignments[assignmentIndex].entries[entryIndex].hasFinished = true;
    const assignmentEntry = storedAssignments[assignmentIndex].entries[entryIndex]
    await saveAssignmentEntry(hostname, assignmentEntry);
  });
  
};

export default submitDetect;