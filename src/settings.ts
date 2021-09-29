export class Settings {
  assignmentCacheInterval?: number;
  quizCacheInterval?: number;
  displayCheckedKadai?: boolean;
  topColorDanger?: string;
  topColorWarning?: string;
  topColorSuccess?: string;
  miniColorDanger?: string;
  miniColorWarning?: string;
  miniColorSuccess?: string;
}

export class DefaultSettings extends Settings {
  static assignmentCacheInterval = 120;
  static quizCacheInterval = 600;
  static displayCheckedKadai = true;
  static topColorDanger = "#f78989";
  static topColorWarning = "#fdd783";
  static topColorSuccess = "#8bd48d";
  static miniColorDanger = "#e85555";
  static miniColorWarning = "#d7aa57";
  static miniColorSuccess = "#62b665";
}
