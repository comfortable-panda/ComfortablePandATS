import { saveHostName } from "./storage";
import { Assignment, CourseSiteInfo } from "./model";
import { createMiniSakai, createMiniSakaiBtn } from "./minisakai";
import { addFavoritedCourseSites } from "./favorites";
import { isLoggedIn, miniSakaiReady, updateIsReadFlag } from "./utils";
import { loadConfigs } from "./settings";

export let courseIDList: Array<CourseSiteInfo>;
export let mergedAssignmentListNoMemo: Array<Assignment>;

async function updateReadFlag() {
    const updatedAssignmentList = updateIsReadFlag(mergedAssignmentListNoMemo);
}

async function main() {
    if (isLoggedIn()) {
        createMiniSakaiBtn();
        const config = await loadConfigs();
        await addFavoritedCourseSites(config.baseURL);
        createMiniSakai();

        miniSakaiReady();
        await updateReadFlag();
        await saveHostName();
    }
}

main();
