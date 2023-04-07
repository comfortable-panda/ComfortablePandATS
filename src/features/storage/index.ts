import { HostnameStorage } from "../../constant";

export const fromStorage = <T>(hostname: string, key: string, decoder: (data: any) => T): Promise<T> => {
    const storageKey = hostname+"-"+key
    return new Promise(function (resolve) {
        chrome.storage.sync.get(storageKey, function (items: any) {
            if (storageKey in items) {
                resolve(decoder(items[storageKey]));
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
    // items[hostname][key]だと1 Objectあたり8192Bの制限に引っかかるのでhostname-keyの形で分散させる
    const storageKey = hostname+"-"+key
    const entity: { [storageKey: string]: [value: any] } = {};
    entity[storageKey] = value;
    return new Promise(function(resolve) {
        chrome.storage.sync.get(storageKey, function (items: any) {
            if (typeof items[storageKey] === "undefined") {
                items[storageKey] = {};
            }
            items[storageKey] = value;
            chrome.storage.sync.set({ [storageKey]: items[storageKey] }, () => {
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