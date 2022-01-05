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
 * Clone DOM elements
 */
function cloneElem(elem: any, dict?: { [key: string]: any }, eventListener?: { [key: string]: (e?: any) => void | Promise<void> }): any {
  const clone = elem.cloneNode(true);
  addAttributes(clone, dict, eventListener);
  return clone;
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

/**
 * Append all elements as child of 1st arg
 */
function appendChildAll(to: HTMLElement, arr: Array<any>): HTMLElement {
  for (const obj in arr) {
    to.appendChild(arr[obj]);
  }
  return to;
}

export const miniSakai = createElem("div", { id: "miniSakai" });
miniSakai.classList.add("cs-minisakai", "cs-tab");

export const assignmentDiv = createElem("div", { className: "cs-assignment-tab" });

export const hamburger = createElem("div", { className: "cs-loading" }, { click: toggleMiniSakai });

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace SettingsDom {
  export const mainDiv = createElem("div", { className: "cp-settings" });
  export const div = createElem("div");
  export const p = createElem("p", { className: "cp-settings-text" });
  export const label = createElem("label");
  export const toggleBtn = createElem("input", { type: "checkbox" });
  export const resetBtn = createElem("input", { type: "button" });
  export const stringBox = createElem("input", { type: "color", className: "cp-settings-inputbox" });
  export const inputBox = createElem("input", { type: "number", className: "cp-settings-inputbox" });
  export const span = createElem("span", { className: "cs-toggle-slider round" });
}

export { SettingsDom, addAttributes, createElem, cloneElem, appendChildAll };