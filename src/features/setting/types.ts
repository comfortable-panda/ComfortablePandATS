type AppInfo = {
    version: string;
    hostname: string;
    currentTime: number;
    useDarkTheme: boolean;
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
};

const CSTheme = {
    light: { textColor: "#464646", bgColor: "#cacaca" },
    dark: { textColor: "#d4d4d4", bgColor: "#555555" }
};

export class Settings {
    appInfo: AppInfo = {
        version: chrome.runtime.getManifest().version,
        hostname: window.location.hostname,
        currentTime: new Date().getTime(),
        useDarkTheme: false
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
    color: CSColor = {
        topDanger: "#f78989",
        topWarning: "#fdd783",
        topSuccess: "#8bd48d",
        miniDanger: "#e85555",
        miniWarning: "#d7aa57",
        miniSuccess: "#62b665",
    };

    setFetchtime(fetchTime: FetchTime) {
        this.fetchTime = fetchTime;
    }

    getTextColor() {
        return this.appInfo.useDarkTheme ? CSTheme.dark.textColor : CSTheme.light.textColor;
    }

    getBgColor() {
        return this.appInfo.useDarkTheme ? CSTheme.dark.bgColor : CSTheme.light.bgColor;
    }
}
