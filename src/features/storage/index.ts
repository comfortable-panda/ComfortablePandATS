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
    return new Promise(function (resolve) {
        chrome.storage.local.get(HostnameStorage, function(items: any) {
            if (typeof items[HostnameStorage] === "undefined") {
                resolve(undefined);
            } else resolve(items[HostnameStorage]);
        });
    });
};

export const toStorage = (hostname: string, key: string, value: any): Promise<string> => {
    const entity: { [key: string]: [value: any] } = {};
    entity[key] = value;
    return new Promise(function(resolve) {
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
};

export const saveHostName = (hostname: string): Promise<string> => {
    return new Promise(function (resolve) {
        chrome.storage.local.set({ [HostnameStorage]: hostname }, () => {
            resolve("saved");
        });
    });
};