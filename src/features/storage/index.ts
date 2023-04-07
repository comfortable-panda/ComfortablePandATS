import { HostnameStorage } from "../../constant";

export const fromStorage = <T>(hostname: string, key: string, decoder: (data: any) => T): Promise<T> => {
    key = hostname+"-"+key
    return new Promise(function (resolve) {
        chrome.storage.sync.get(key, function (items: any) {
            if (key in items) {
                resolve(decoder(items[key]));
            } else {
                resolve(decoder(undefined));
            }
        });
    });
};

export const loadHostName = (): Promise<string | undefined> => {
    return new Promise(function (resolve) {
        chrome.storage.sync.get(HostnameStorage, function(items: any) {
            if (typeof items[HostnameStorage] === "undefined") {
                resolve(undefined);
            } else resolve(items[HostnameStorage]);
        });
    });
};

export const toStorage = (hostname: string, key: string, value: any): Promise<string> => {
    key = hostname+"-"+key
    const entity: { [key: string]: [value: any] } = {};
    entity[key] = value;
    return new Promise(function(resolve) {
        chrome.storage.sync.get(key, function (items: any) {
            if (typeof items[key] === "undefined") {
                items[key] = {};
            }
            items[key] = value;
            chrome.storage.sync.set({ [key]: items[key] }, () => {
                resolve("saved");
            });
        });
    });
};

export const saveHostName = (hostname: string): Promise<string> => {
    return new Promise(function (resolve) {
        chrome.storage.sync.set({ [HostnameStorage]: hostname }, () => {
            resolve("saved");
        });
    });
};