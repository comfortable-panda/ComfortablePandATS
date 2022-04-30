import { Settings } from "./types";

export const decodeSettings = (data: any): Settings => {
    const settings = new Settings();
    if (typeof data === "undefined") return settings;
    settings.appInfo = data.appInfo;
    settings.fetchTime = data.fetchTime;
    settings.cacheInterval = data.cacheInterval;
    settings.miniSakaiOption = data.miniSakaiOption;
    settings.color = data.color;
    return settings;
};
