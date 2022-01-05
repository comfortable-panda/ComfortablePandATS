/**
 * Get all keys in local storage
 */
function getKeys(): Promise<any> {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(null, function (keys: any) {
      resolve(Object.keys(keys));
    });
  });
}

/**
 * Load from local storage
 * @param {string} key
 * @param {string} ifUndefinedType Can specify response type if result was undefined
 */
function loadFromLocalStorage(key: string, ifUndefinedType = "array"): Promise<any> {
  const baseURL = window.location.hostname;
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(baseURL, function (items: any) {
      if (typeof items[baseURL] === "undefined" || typeof items[baseURL][key] === "undefined") {
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
      } else resolve(items[baseURL][key]);
    });
  });
}

/**
 * Load from local storage
 * FOR SubSakai since it might not be executed in SakaiLMS.
 * @param {string} baseURL
 * @param {string} key
 */
function loadFromLocalStorage2(baseURL: string, key: string): Promise<any> {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(baseURL, function (items: any) {
      if (typeof items[baseURL] === "undefined" || typeof items[baseURL][key] === "undefined") {
        resolve([]);
      } else resolve(items[baseURL][key]);
    });
  });
}

/**
 * Save to local storage
 * @param {string} key
 * @param {any} value
 */
function saveToLocalStorage(key: string, value: any): Promise<any> {
  const baseURL = window.location.hostname;
  const entity: { [key: string]: [value: any] } = {};
  entity[key] = value;
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(baseURL, function (items: any) {
      if (typeof items[baseURL] === "undefined") {
        items[baseURL] = {};
      }
      items[baseURL][key] = value;
      chrome.storage.local.set({ [baseURL]: items[baseURL] }, () => {
        resolve("saved");
      });
    });
  });
}

export { loadFromLocalStorage, loadFromLocalStorage2, saveToLocalStorage, getKeys };
