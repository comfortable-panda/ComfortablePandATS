import { HostnameStorage } from "../../constant";

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

export const loadHostName = (): Promise<string | undefined> => {
    const key = "CS_Hostname";
    return new Promise(function (resolve) {
        chrome.storage.local.get(HostnameStorage, function(items: any) {
            if (typeof items[key] === "undefined") {
                resolve(undefined);
            } else resolve(items[key]);
        });
    });
};
