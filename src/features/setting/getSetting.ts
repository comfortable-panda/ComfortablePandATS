import { Settings } from "./types";
import { decodeSettings } from "./decode";
import { fromStorage } from "../storage";
import { CurrentTime, SettingsStorage, VERSION } from "../../constant";
import { getFetchTime } from "../../utils";

export const getStoredSettings = async (hostname: string): Promise<Settings> => {
    const settings = await fromStorage<Settings>(hostname, SettingsStorage, decodeSettings);
    const fetchTime = await getFetchTime(settings.appInfo.hostname);
    settings.appInfo.currentTime = CurrentTime;
    settings.appInfo.hostname = hostname;
    settings.appInfo.version = VERSION;
    settings.setFetchtime(fetchTime);

    return settings;
};
