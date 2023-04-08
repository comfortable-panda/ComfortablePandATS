import { HostnameStorage, SyncSupportStorage } from "../../constant";
import { decodesyncSupport } from "../setting/decode"

export const fromStorage = async <T>(hostname: string, key: string, decoder: (data: any) => T, allowSync: boolean=true): Promise<T> => {
    const storageKey = hostname+"-"+key
    if (allowSync){
        const syncSupport = await fromStorage<boolean>(hostname, SyncSupportStorage, decodesyncSupport, false);
        console.warn(syncSupport);
        if(syncSupport){
            return new Promise(function (resolve) {
                chrome.storage.sync.get(storageKey, function (items: any) {
                    if (storageKey in items) {
                        resolve(decoder(items[storageKey]));
                    } else {
                        resolve(decoder(undefined));
                    }
                });
            });
        }
    }

    return new Promise(function (resolve) {
        chrome.storage.local.get(storageKey, function (items: any) {
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
        chrome.storage.local.get(HostnameStorage, function(items: any) {
            if (typeof items[HostnameStorage] === "undefined") {
                resolve(undefined);
            } else resolve(items[HostnameStorage]);
        });
    });
};

export const toStorage = async (hostname: string, key: string, value: any, allowSync: boolean=true): Promise<string> => {
    // items[hostname][key]だと1 Objectあたり8192Bの制限に引っかかるのでhostname-keyの形で分散させる
    const storageKey = hostname+"-"+key
    const entity: { [storageKey: string]: [value: any] } = {};
    entity[storageKey] = value;

    if(allowSync){
        const syncSupport = await fromStorage<boolean>(hostname, SyncSupportStorage, decodesyncSupport, false);
        if(syncSupport){
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
        }
    }

    return new Promise(function(resolve) {
        chrome.storage.local.get(storageKey, function (items: any) {
            if (typeof items[storageKey] === "undefined") {
                items[storageKey] = {};
            }
            items[storageKey] = value;
            chrome.storage.local.set({ [storageKey]: items[storageKey] }, () => {
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