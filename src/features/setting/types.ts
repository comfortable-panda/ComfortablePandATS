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

export class Settings {
  cacheInterval: CacheInterval = {
    assignment: 120,
    quiz: 600,
  };
  displayOption: DisplayOption = {
    showCompletedEntry: true,
    showLateAcceptedEntry: false,
  };
  color: CSColor = {
    topDanger: "#f78989",
    topWarning: "#fdd783",
    topSuccess: "#8bd48d",
    miniDanger: "#e85555",
    miniWarning: "#e85555",
    miniSuccess: "#62b665",
  };
}
