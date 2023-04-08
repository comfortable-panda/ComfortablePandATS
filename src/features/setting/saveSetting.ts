import { Settings } from "./types";
import { toStorage } from "../storage";
import { SettingsStorage, SyncSettingsStorage } from "../../constant";

export const saveSettings = (hostname: string, settings: Settings): Promise<string> => {
    toStorage(hostname, SyncSettingsStorage, settings.syncSupport, false);
    return toStorage(hostname, SettingsStorage, settings);
};
