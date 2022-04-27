export interface EntityProtocol {
  course: {
    id: string;
  };
  entries: Array<EntryProtocol>;
  isRead: boolean;
  getEntriesMap(): Map<string, EntryProtocol>;
}

export interface EntryProtocol {
  hasFinished: boolean;
}
