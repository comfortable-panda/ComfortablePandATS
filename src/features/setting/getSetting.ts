import { Settings } from "./types";
import { decodeSettings } from "./decode";
import { fromStorage } from "../storage/load";
import { SettingsStorage } from "../../constant";

export const getStoredSettings = (hostname: string): Promise<Settings> => {
  return fromStorage<Settings>(hostname, SettingsStorage, decodeSettings);
};
