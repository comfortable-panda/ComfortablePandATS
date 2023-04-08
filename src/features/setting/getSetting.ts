import { Settings } from "./types";
import { decodeSettings,decodesyncSupport } from "./decode";
import { fromStorage } from "../storage";
import { CurrentTime, SettingsStorage,SyncSettingsStorage, VERSION } from "../../constant";
import { getFetchTime } from "../../utils";

export const getStoredSettings = async (hostname: string): Promise<Settings> => {
    const syncSupport = await fromStorage<boolean>(hostname, SyncSettingsStorage, decodesyncSupport);
    const settings = await fromStorage<Settings>(hostname, SettingsStorage, decodeSettings);
    const fetchTime = await getFetchTime(settings.appInfo.hostname);
    settings.appInfo.currentTime = CurrentTime;
    settings.appInfo.hostname = hostname;
    settings.appInfo.version = VERSION;
    settings.setFetchtime(fetchTime);
    settings.syncSupport = syncSupport;

    return settings;
};
