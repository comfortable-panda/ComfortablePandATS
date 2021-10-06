function loadFromLocalStorage(key: string, ifUndefinedType = "array"): Promise<any> {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(key, function (items: any) {
      if (typeof items[key] === "undefined") {
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
      }
      else resolve(items[key]);
    });
  });
}

function saveToLocalStorage(key: string, value: any): Promise<any> {
  const entity: { [key: string]: [value: any] } = {};
  entity[key] = value;
  return new Promise(function (resolve, reject) {
    chrome.storage.local.set(entity, () => {
      resolve("saved");
    });
  });
}

export { loadFromLocalStorage, saveToLocalStorage };
