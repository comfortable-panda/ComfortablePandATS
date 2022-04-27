import { EntityProtocol, EntryProtocol } from "../entity/type";

const getEntitiesMap = <Entity extends EntityProtocol>(entities: Array<Entity>): Map<string, Entity> => {
  return entities.reduce((map, entity) => {
    return map.set(entity.course.id, entity);
  }, new Map<string, Entity>());
};

export const mergeEntities = <Entity extends EntityProtocol>(oldEntities: Array<Entity>, newEntities: Array<Entity>): Array<Entity> => {
  const arr: Array<Entity> = [];
  const oldEntitiesMap = getEntitiesMap(oldEntities);
  const newEntitiesMap = getEntitiesMap(newEntities);
  newEntitiesMap.forEach((entity, id) => {
    const oldEntity = oldEntitiesMap.get(id);
    if (oldEntity !== undefined) {
      entity.entries = mergeEntries(oldEntity.getEntriesMap(), entity.getEntriesMap());
      entity.isRead = oldEntity.isRead;
    }
    arr.push(entity);
  });
  return arr;
};

export const mergeEntries = <Entry extends EntryProtocol>(oldEntryMap: Map<string, Entry>, newEntryMap: Map<string, Entry>): Array<Entry> => {
  const arr: Array<Entry> = [];
  newEntryMap.forEach((entry, id) => {
    const oldEntry = oldEntryMap.get(id);
    if (oldEntry !== undefined) {
      entry.hasFinished = oldEntry.hasFinished;
    }
    arr.push(entry);
  });
  return arr;
};
