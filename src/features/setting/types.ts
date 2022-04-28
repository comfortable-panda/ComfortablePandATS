type AppInfo = {
    version: string;
    hostname: string;
};

export type FetchTime = {
    assignment: number | undefined;
    quiz: number | undefined;
};

type CacheInterval = {
    assignment: number;
    quiz: number;
};

type DisplayOption = {
    showCompletedEntry: boolean;
    showLateAcceptedEntry: boolean;
};

type CSColor = {
    topDanger: string;
    topWarning: string;
    topSuccess: string;
    miniDanger: string;
    miniWarning: string;
    miniSuccess: string;
    textColor: string;
    bgColor: string;
};

const CSTheme = {
    light: { textColor: "#464646", bgColor: "#cacaca" },
    dark: { textColor: "#d4d4d4", bgColor: "#555555" }
};

export class Settings {
    appInfo: AppInfo = {
        version: chrome.runtime.getManifest().version,
        hostname: window.location.hostname
    };
    fetchTime: FetchTime = {
        assignment: undefined,
        quiz: undefined
    };
    cacheInterval: CacheInterval = {
        assignment: 120,
        quiz: 600
    };
    miniSakaiOption: DisplayOption = {
        showCompletedEntry: true,
        showLateAcceptedEntry: false
    };
    useDarkTheme = false;
    color: CSColor = {
        topDanger: "#f78989",
        topWarning: "#fdd783",
        topSuccess: "#8bd48d",
        miniDanger: "#e85555",
        miniWarning: "#d7aa57",
        miniSuccess: "#62b665",
        // 下記2つは変更不可
        textColor: this.useDarkTheme ? CSTheme.dark.textColor : CSTheme.light.textColor,
        bgColor: this.useDarkTheme ? CSTheme.dark.bgColor : CSTheme.light.bgColor
    };
}
