import { Settings } from "./types";
import { toStorage } from "../storage/save";
import { SettingsStorage } from "../../constant";

export const saveSettings = (hostname: string, settings: Settings): Promise<string> => {
  return toStorage(hostname, SettingsStorage, settings);
};
