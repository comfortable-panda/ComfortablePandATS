import { Settings } from "./types";
import { toStorage } from "../storage";
import { SettingsStorage, SyncSupportStorage } from "../../constant";

export const saveSettings = (hostname: string, settings: Settings): Promise<string> => {
    console.log(settings);
    toStorage(hostname, SyncSupportStorage, settings.syncSupport, false);
    return toStorage(hostname, SettingsStorage, settings);
};
