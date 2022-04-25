import { Settings } from "./types";
import { decodeSettings } from "./decode";
import { fromStorage } from "../storage/load";

export const getStoredSettings = (hostname: string): Promise<Settings> => {
  return fromStorage<Settings>(hostname, "CS_Settings", decodeSettings);
};
