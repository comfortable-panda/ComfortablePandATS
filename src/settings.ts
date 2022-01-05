import { loadFromLocalStorage } from "./storage";
import { convertArrayToSettings } from "./utils";

export class Settings {
  assignmentCacheInterval?: number;
  quizCacheInterval?: number;
  displayCheckedAssignment?: boolean;
  displayLateSubmitAssignment?: boolean;
  topColorDanger?: string;
  topColorWarning?: string;
  topColorSuccess?: string;
  miniColorDanger?: string;
  miniColorWarning?: string;
  miniColorSuccess?: string;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  get getAssignmentCacheInterval(): number {
    return this.assignmentCacheInterval ? this.assignmentCacheInterval : DefaultSettings.assignmentCacheInterval;
  }
  get getQuizCacheInterval(): number {
    return this.quizCacheInterval ? this.quizCacheInterval : DefaultSettings.quizCacheInterval;
  }
  get getDisplayCheckedAssignment(): boolean {
    return this.displayCheckedAssignment !== undefined
      ? this.displayCheckedAssignment
      : DefaultSettings.displayCheckedAssignment;
  }
  get getDisplayLateSubmitAssignment(): boolean {
    return this.displayLateSubmitAssignment !== undefined
      ? this.displayLateSubmitAssignment
      : DefaultSettings.displayLateSubmitAssignment;
  }
  get getTopColorDanger(): string {
    return this.topColorDanger ? this.topColorDanger : DefaultSettings.topColorDanger;
  }
  get getTopColorWarning(): string {
    return this.topColorWarning ? this.topColorWarning : DefaultSettings.topColorWarning;
  }
  get getTopColorSuccess(): string {
    return this.topColorSuccess ? this.topColorSuccess : DefaultSettings.topColorSuccess;
  }
  get getMiniColorDanger(): string {
    return this.miniColorDanger ? this.miniColorDanger : DefaultSettings.miniColorDanger;
  }
  get getMiniColorWarning(): string {
    return this.miniColorWarning ? this.miniColorWarning : DefaultSettings.miniColorWarning;
  }
  get getMiniColorSuccess(): string {
    return this.miniColorSuccess ? this.miniColorSuccess : DefaultSettings.miniColorSuccess;
  }
}

export class DefaultSettings extends Settings {
  static assignmentCacheInterval = 120;
  static quizCacheInterval = 600;
  static displayCheckedAssignment = true;
  static displayLateSubmitAssignment = false;
  static topColorDanger = "#f78989";
  static topColorWarning = "#fdd783";
  static topColorSuccess = "#8bd48d";
  static miniColorDanger = "#e85555";
  static miniColorWarning = "#d7aa57";
  static miniColorSuccess = "#62b665";
}

export async function loadSettings(): Promise<Settings> {
  const settingsArr = await loadFromLocalStorage("CS_Settings");
  const CPsettings = convertArrayToSettings(settingsArr);
  CPsettings.displayCheckedAssignment = CPsettings.getDisplayCheckedAssignment;
  return CPsettings;
}
