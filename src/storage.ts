function loadFromLocalStorage(key: string, ifUndefinedType = "array"): Promise<any> {
  const hostName = window.location.hostname;
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(hostName, function (items: any) {
      if (typeof items[hostName] === "undefined" || typeof items[hostName][key] === "undefined") {
        let res: any;
        switch (ifUndefinedType) {
          case "number":
            res = 0;
            break;
          case "string":
            res = "";
            break;
          case "undefined":
            res = undefined;
            break;
          default:
            res = [];
            break;
        }
        resolve(res);
      } else resolve(items[hostName][key]);
    });
  });
}

function loadFromLocalStorage2(key: string): Promise<any> {
  const hostName = "panda.ecs.kyoto-u.ac.jp";
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(hostName, function (items: any) {
      if (typeof items[hostName] === "undefined" || typeof items[hostName][key] === "undefined") {
        resolve([]);
      } else resolve(items[hostName][key]);
    });
  });
}

function saveToLocalStorage(key: string, value: any): Promise<any> {
  const hostName = window.location.hostname;
  const entity: { [key: string]: [value: any] } = {};
  entity[key] = value;
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(hostName, function (items: any) {
      if (typeof items[hostName] === "undefined") {
        items[hostName] = {};
      }
      items[hostName][key] = value;
      chrome.storage.local.set({ [hostName]: items[hostName] }, () => {
        resolve("saved");
      });
    });
  });
}

export { loadFromLocalStorage, loadFromLocalStorage2, saveToLocalStorage };
