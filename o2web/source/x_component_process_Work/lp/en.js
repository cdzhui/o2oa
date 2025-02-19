MWF.xApplication = MWF.xApplication || {};
MWF.xApplication.process = MWF.xApplication.process || {};
MWF.xApplication.process.Work = MWF.xApplication.process.Work || {};
MWF.xApplication.process.Work.LP = {
	"title": "Work",
    "selectRoute": "Route",
    "inputOpinion": "Opinion",
    "selectPerson" : "Select Person",
    "cancel": "Cancel",
    "ok": "Submit",
    "close": "Close",
    "saveWrite": "Save",
    "inputText": "Input process opinion here",

    "mustSelectRoute": "Please choose decision",
    "mustSelectRouteGroup" : "Please select the decision group",
    "opinionRequired" : "Please input process opinion",

    "searchKey": "Please enter key words",

    "task": "Task",
    "done": "TaskCompleted",
    "draft": "Draft",
    "myfile": "Myfile",
    "reset": "Reset",
    "reroute": "Reroute",
    "addSplit": "AddSplit",
    "rollback": "Rollback",
    "goBack": "GoBack",

    "phone": "Phone",
    "mail": "Mail",
    "save": "Save",
    "process": "Flow",
    "flowWork": "Process Work",
    "handwriting": "Write",
    "audioRecord": "Record",

    "noAppendTaskIdentityConfig" : "No transferor is configured, please contact the administrator",
    "selectAppendTaskIdentityNotice" : "Please select the transferor",
    "routeValidFailure" : "Route verification failed",
    "loadedOrgCountUnexpected" : "The personnel selection interface has not been loaded, please wait...",

    "taskCompletedPerson": "办理人",
    "readPerson": "Reader",
    "systemFlow": "Automatic processing",

    "openWorkError": "You do not have permission to view this document or it has been deleted.",

    "rollbackConfirmTitle": "Rollback confirmation",
    "rollbackConfirmContent": "Are you sure you want to rollback the process back to the \"{log}\" state? (Process rollback will clear all information after this state)",

    "recoverFileConfirmTitle": "Recover text confirmation",
    "recoverFileConfirmContent": "Are you sure you want to restore the text to the \"{att}\" version? (After restoring, the saved temporary files will be deleted and you cannot restore them again)",

    "notRecoverFileConfirmTitle": "Cancel text recovery confirmation",
    "notRecoverFileConfirmContent": "Are you sure you want to cancel the body recovery? (After canceling, the saved temporary files will be deleted and you cannot restore it again)",

    "closePageCountDownText": "The page will be closed in \"{second}\" seconds!",
    "closePage": "Close",

    "selectRouteGroup": "Select Decision Group",
    "defaultDecisionOpinionName": "Other",
    "routeGroupOrderList": ["Agree","Disagree","Other","Other"],

    "selectWork": "The file you want to open has formed multiple branches, please select one to view:",
    "currentActivity": "Current Activity: ",
    "currentUsers": "Current processor: ",
    "completedWork": "File processing completed",

    "managerProcessNotice": "Note: The quick processing function is suitable for the following situations: <br\>1, the required items have been filled in the form.<br\>2, there is no need to select a person when submitting.<br \>3. There is no content calculated based on user identity.<br\>You are an administrator, you can simulate a person and submit.",
    "managerLogin": "Simulate login and open file",
    "managerLoginConfirmTitle": "Simulated Login",
    "managerLoginConfirmContent": "Are you sure you want to log in as {user} and open the file? After clicking OK, you need to log out and log in again to return to the current user.",
    "managerLoginSuccess": "Successfully switched to {user}",

    "selectIdentity": "Select the identity for this job",
    "selectIdentityInfo": "It is detected that you have multiple pending identities for the current job, please select an identity to handle this job",

    "org": "Unit",
    "duty": "Duty",

    "flowActions": {
         "addTask": "Add",
         "reset": "Reset",
         "process": "Submit",
         "goBack": "Back"
     },
     "modeType": "Processing type",
     "single": "single",
     "queue": "serial",
     "parallel": "parallel",
     "addTaskType": "Position",
     "addTaskBefore": "Add before",
     "addTaskAfter": "Add after",
     "opinion": "opinion",
     "addTaskPerson": "Person",
     "inputOpinionNote": "Please fill in your opinion here",
     "inputAddTaskPeople": "Please select the signer",
     "inputResetPeople": "Please select the reset person",
     "inputAddTaskType": "Please select the signing method",
     "inputModeType": "Please select the processing type",
     "resetTo": "reset to",
     "keepTask": "Keep my to-do",
     "quickSelect": "QuickSelect",
     "empowerTo": "authorize to",
     "selectAll": "Select all",
     "ok1": "OK",
     "not": "no",
     "selectPerson1": "Please select a person",
     "noQuickSelectDataNote": "The system has not recorded the data you selected at the current node.",
     "submitQuickText": "Select [{route}], opinion: {opinion}{org}.",
     "addTaskQuickText": "Select [{route}{mode}], opinion: {opinion}, signer: {org}.",
     "resetQuickText": "Opinion: {opinion}, reset to: {org}.",

    "users": "handler",
    "goBackActivity": "Return to activity",
    "goBackActivityWay": "Processing after return:",
    "goBackActivityWayStep": "Flow according to the process",
    "goBackActivityWayJump": "Go back to the returner",
    "goBackTo": "Return to:",
    "selectGoBackActivity": "Please select the activity to return"
};
MWF.xApplication.process.Work["lp."+o2.language] = MWF.xApplication.process.Work.LP;
