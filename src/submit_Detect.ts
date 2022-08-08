const submitDetect = () => {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
  
    const callback = function (mutationsList: any, observer: any) {
      const postButton = document.querySelector("[name='post']");
  
      console.log("changed")
  
      if (!postButton) {
        return;
      }
  
      if (postButton.hasAttribute("watch")) {
        return;
      }
  
      const get_assignment = (document.querySelector("#addSubmissionForm > [name=\"assignmentId\"]") as HTMLInputElement).value;
  
      const assignment_id = get_assignment.split("/").slice(-1)[0];
  
      postButton.addEventListener("click", () => { postButton.setAttribute("watch", true.toString());});
      postButton.addEventListener("click", () => { 
  
        const site_id = location.href.split("/")[5];
  
        interface ValueInterface { "192.168.220.33": { "AssignmentFetchTime": 1659205438.482, "Assignments": [{ "course": { "id": "b6d39d0c-0069-4c3a-a49e-bcd5319059a1", "link": "http://192.168.220.33:8080/portal/site/b6d39d0c-0069-4c3a-a49e-bcd5319059a1", "name": "test" }, "entries": [{ "closeTime": 1659768000, "dueTime": 1659077100, "hasFinished": true, "id": "0187b913-aa6e-4f93-8f5d-500b7dab1cfb", "title": "test3" }, { "closeTime": 1850719800, "dueTime": 1786438200, "hasFinished": false, "id": "52fc6bf7-f8e2-4593-b559-37eec13f7595", "title": "test - コピー" }, { "closeTime": 1850719800, "dueTime": 1786438200, "hasFinished": false, "id": "9ffd4a1e-d594-46ba-8e41-0310fa5ae428", "title": "test" }], "isRead": true }], "QuizFetchTime": 1659205158.715, "Quizzes": [{ "course": { "id": "b6d39d0c-0069-4c3a-a49e-bcd5319059a1", "link": "http://192.168.220.33:8080/portal/site/b6d39d0c-0069-4c3a-a49e-bcd5319059a1", "name": "test" }, "entries": [], "isRead": true }] }, "Hostname": "192.168.220.33" }
  
        chrome.storage.local.get(null, (value) => {
          console.log("saved");
          const hostname = (value as ValueInterface)["Hostname"];
          const assignments = (value as ValueInterface)[hostname].Assignments;
          const assignmentIndex = assignments.findIndex(x => x.course.id === site_id);
          const entryIndex = assignments[assignmentIndex].entries.findIndex(x => x.id === assignment_id);
  
          (value as ValueInterface)[hostname].Assignments[assignmentIndex].entries[entryIndex].hasFinished = true;
          const value_tmp = { [String(hostname)]: value[hostname]};
          chrome.storage.local.set(value_tmp);
        });
  
      });
  
    };
  
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  
    console.log("loaded")
    
  }
  
  export default submitDetect;