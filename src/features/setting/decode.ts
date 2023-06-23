import { Settings } from "./types";

export const decodeSettings = (data: any): Settings => {
    const settings = new Settings();
    if (typeof data === "undefined") return settings;
    settings.appInfo = data.appInfo;
    settings.fetchTime = data.fetchTime;
    settings.cacheInterval = data.cacheInterval;
    settings.miniSakaiOption = data.miniSakaiOption;
    settings.timeUntilDeadline = data.timeUntilDeadline;
    // For backward compatibility
    for (const colorName of Object.getOwnPropertyNames(settings.color)) {
        if (typeof data.color[colorName] !== "undefined") {
            // @ts-ignore
            settings.color[colorName] = data.color[colorName];
        }
    }
    return settings;
};
