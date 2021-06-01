export function detectSubmission(callback: (info: {siteId: string, assignmentId: string}) => void) {
    const addSubmissionForm = document.querySelector('#addSubmissionForm');
    if (addSubmissionForm == null) {
        console.log('no submission forms');
        return;
    }

    const addSubmissionFormInputs = addSubmissionForm.querySelectorAll('input');
    let assignmentIdInput = null;
    for (let i=0; i<addSubmissionFormInputs.length; i++) {
        const input = addSubmissionFormInputs.item(i);
        if (input.name == 'assignmentId') {
            assignmentIdInput = input;
            break;
        }
    }
    if (assignmentIdInput == null) {
        console.log('failed to find #assignmentId');
        return;
    }

    const assignmentIdValue = assignmentIdInput.getAttribute('value');
    if (assignmentIdValue == null) {
        console.log('#assignmentId has no attributes named value');
        return;
    }
    const match = assignmentIdValue.match(`^/assignment/a/([^/]+)/([^/]+)$`);
    if (match == null) {
        console.log('before submission');
        return;
    }
    const siteId = match[1];
    const assignmentId = match[2];
    callback({
        siteId: siteId,
        assignmentId: assignmentId
    });
}
