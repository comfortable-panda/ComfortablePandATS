export const fromStorage = <T>(hostname: string, key: string, decoder: (data: any) => T): Promise<T> => {
  return new Promise(function (resolve) {
    chrome.storage.local.get(hostname, function (items: any) {
      resolve(decoder(items[hostname][key]));
    });
  });
};
