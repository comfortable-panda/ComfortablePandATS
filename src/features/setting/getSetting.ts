import { Settings } from "./types";
import { fromStorage } from "../storage/load";
import { decodeSettings } from "./decode";

export const getStoredSettings = (hostname: string): Promise<Settings> => {
  return fromStorage<Settings>(hostname, "CS_Settings", decodeSettings);
};
