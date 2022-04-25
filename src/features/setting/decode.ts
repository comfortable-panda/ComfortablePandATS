import { Settings } from "./types";

export const decodeSettings = (data: any): Settings => {
  const settings = new Settings();
  if (typeof data === "undefined") return settings;
  settings.cacheInterval = data.cacheInterval;
  settings.miniSakaiOption = data.displayOption;
  settings.useDarkTheme = data.useDarkTheme;
  settings.color = data.color;
  return settings;
};
