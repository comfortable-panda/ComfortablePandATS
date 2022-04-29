import { DueCategory, getDaysUntil } from "../utils";
import { Settings } from "../features/setting/types";
import { EntityProtocol, EntryProtocol } from "../features/entity/type";
import { MaxTimestamp } from "../constant";

const dueCategoryClassMap: { [key in DueCategory]: string } = {
    due24h: "cs-tab-danger",
    due5d: "cs-tab-warning",
    due14d: "cs-tab-success",
    dueOver14d: "cs-tab-other",
    duePassed: ""
};

/**
 * Add notification badge for new Assignment/Quiz
 */
export async function createFavoritesBar(settings: Settings, entities: EntityProtocol[]): Promise<void> {
    const defaultTab = document.querySelectorAll(".Mrphs-sitesNav__menuitem");
    const defaultTabCount = Object.keys(defaultTab).length;

    const courseMap = new Map<string, { entries: EntryProtocol[]; isRead: boolean }>(); // courseID => {EntryProtocol[], isRead}
    for (const entity of entities) {
        let entries = courseMap.get(entity.course.id);
        if (entries === undefined) {
            entries = { entries: [], isRead: true };
            courseMap.set(entity.course.id, entries);
        }
        entries.entries.push(...entity.entries);
        entries.isRead = entries.isRead && (entity.isRead || entity.entries.length === 0);
    }

    const dueMap = new Map<string, { due: DueCategory; isRead: boolean }>(); // courseID => DueCategory, isRead
    for (const [courseID, entries] of courseMap.entries()) {
        if (entries.entries.length === 0) continue;
        const closestTime = entries.entries
            .filter((e) => {
                if (settings.miniSakaiOption.showCompletedEntry) {
                    if (!settings.miniSakaiOption.showLateAcceptedEntry) return settings.appInfo.currentTime < e.dueTime * 1000;
                } else {
                    if (e.hasFinished) return false;
                }
                return true;
            })
            .reduce((prev, e) => Math.min(e.dueTime, prev), MaxTimestamp);
        if (closestTime === MaxTimestamp) continue;
        const daysUntilDue = getDaysUntil(settings.appInfo.currentTime, closestTime * 1000);
        dueMap.set(courseID, { due: daysUntilDue, isRead: entries.isRead });
    }

    for (let j = 2; j < defaultTabCount; j++) {
        const aTag = defaultTab[j].getElementsByClassName("link-container")[0] as HTMLAnchorElement | undefined;
        const href = aTag?.href;
        const hrefContent = href?.match("(https?://[^/]+)/portal/site-?[a-z]*/([^/]+)");
        if (hrefContent === undefined || hrefContent === null) {
            continue;
        }
        const courseID = hrefContent[2];
        if (courseID === undefined) continue;
        const courseInfo = dueMap.get(courseID);
        if (courseInfo === undefined) continue;

        if (!courseInfo.isRead) {
            defaultTab[j].classList.add("cs-notification-badge");
        }

        const tabClass = dueCategoryClassMap[courseInfo.due];
        const aTagCount = defaultTab[j].getElementsByTagName("a").length;
        for (let i = 0; i < aTagCount; i++) {
            defaultTab[j].getElementsByTagName("a")[i].classList.add(tabClass);
        }
        defaultTab[j].classList.add(tabClass);
    }
}

export const deleteFavoritesBar = (): void => {
    const classList = ["cs-notification-badge", "cs-tab-danger", "cs-tab-warning", "cs-tab-success", "cs-tab-other"];
    for (const c of classList) {
        const q = document.querySelectorAll(`.${c}`);
        // @ts-ignore
        for (const _ of q) {
            _.classList.remove(`${c}`);
            _.style = "";
        }
    }
}