export const fromStorage = (key: string, decoder: any): Promise<any> => {
  const hostname = window.location.hostname;
  return new Promise(function (resolve) {
    chrome.storage.local.get(hostname, function (items: any) {
      resolve(decoder(items[hostname][key]));
    });
  });
}