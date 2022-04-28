export const fromStorage = <T>(hostname: string, key: string, decoder: (data: any) => T): Promise<T> => {
    return new Promise(function (resolve) {
        chrome.storage.local.get(hostname, function (items: any) {
            if (hostname in items && key in items[hostname]) {
                resolve(decoder(items[hostname][key]));
            } else {
                resolve(decoder(undefined));
            }
        });
    });
};
