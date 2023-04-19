import { HostnameStorage, SyncSupportStorage } from "../../constant";
import { decodesyncSupport } from "../setting/decode";
import LZString from "lz-string";

export const fromStorage = async <T>(
    hostname: string,
    key: string,
    decoder: (data: any) => T,
    allowSync = true
): Promise<T> => {
    const storageKey = hostname + "-" + key;
    if (allowSync) {
        const syncSupport = await fromStorage<boolean>(hostname, SyncSupportStorage, decodesyncSupport, false);
        if (syncSupport) {
            return new Promise(function (resolve) {
                chrome.storage.sync.get(storageKey, function (items: any) {
                    if (storageKey in items) {
                        resolve(decoder(JSON.parse(LZString.decompressFromUTF16(items[storageKey]))));
                    } else {
                        resolve(decoder(undefined));
                    }
                });
            });
        }
    }

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
        chrome.storage.local.get(HostnameStorage, function (items: any) {
            if (typeof items[HostnameStorage] === "undefined") {
                resolve(undefined);
            } else resolve(items[HostnameStorage]);
        });
    });
};

export const toStorage = async (hostname: string, key: string, value: any, allowSync = true): Promise<string> => {
    // items[hostname][key]だと1 Objectあたり8192Bの制限に引っかかるのでhostname-keyの形で分散させる
    const storageKey = hostname + "-" + key;

    if (allowSync) {
        const syncSupport = await fromStorage<boolean>(hostname, SyncSupportStorage, decodesyncSupport, false);
        if (syncSupport) {
            return new Promise(function (resolve) {
                chrome.storage.sync.get(storageKey, function (items: any) {
                    if (typeof items[storageKey] === "undefined") {
                        items[storageKey] = {};
                    }
                    items[storageKey] = LZString.compressToUTF16(JSON.stringify(value));
                    chrome.storage.sync.set({ [storageKey]: items[storageKey] }, () => {
                        resolve("saved");
                    });
                });
            });
        }
    }

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