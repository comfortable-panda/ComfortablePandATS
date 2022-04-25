import { Settings } from "./types";
import { toStorage } from "../storage/save";

export const saveSettings = (hostname: string, settings: Settings): Promise<string> => {
  return toStorage(hostname, "CS_Settings", settings);
};
