import { saveHostName } from "./storage";
import { createMiniSakai, createMiniSakaiBtn } from "./minisakai";
import { isLoggedIn, miniSakaiReady } from "./utils";

async function updateReadFlag() {
    // const updatedAssignmentList = updateIsReadFlag(mergedAssignmentListNoMemo);
}

async function main() {
    if (isLoggedIn()) {
        createMiniSakaiBtn();
        createMiniSakai();

        miniSakaiReady();
        await updateReadFlag();
        await saveHostName();
    }
}

main();
