import { toggleMiniSakai } from "./eventListener";

/**
 * Create DOM elements
 */
function createElem(tag: string, dict?: { [key: string]: any }, eventListener?: { [key: string]: (e?: any) => void | Promise<void> }): any {
    const elem = document.createElement(tag);
    addAttributes(elem, dict, eventListener);
    return elem;
}

/**
 * Add attributes to DOM elements
 */
function addAttributes(elem: any, dict?: { [key: string]: any }, eventListener?: { [key: string]: (e?: any) => void | Promise<void> }): any {
    for (const key in dict) {
        if (key === "style") elem[key].display = dict[key];
        else {
            // @ts-ignore
            elem[key] = dict[key];
        }
    }
    for (const key in eventListener) {
        elem.addEventListener(key, eventListener[key]);
    }
    return elem;
}

export const miniSakai = createElem("div", { id: "miniSakai" });
miniSakai.classList.add("cs-minisakai", "cs-tab");

export const hamburger = createElem("button", { className: "cs-loading" }, { click: toggleMiniSakai });

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace SettingsDom {
    export const div = createElem("div");
    export const p = createElem("p", { className: "cp-settings-text" });
    export const label = createElem("label");
}

export { SettingsDom, addAttributes, createElem };