export const toStorage = (key: string, value: any): Promise<any> => {
  const hostname = window.location.hostname;
  const entity: { [key: string]: [value: any] } = {};
  entity[key] = value;
  return new Promise(function (resolve) {
    chrome.storage.local.get(hostname, function (items: any) {
      if (typeof items[hostname] === "undefined") {
        items[hostname] = {};
      }
      items[hostname][key] = value;
      chrome.storage.local.set({ [hostname]: items[hostname] }, () => {
        resolve("saved");
      });
    });
  });
}