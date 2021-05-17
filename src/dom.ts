import { toggleMiniPandA } from "./eventListener";


function addAttributes(elem: any, dict?: { [key: string]: any }, eventListener?: { [key: string]: (e?:any)=>void|Promise<void> }): any{
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

function createElem(tag: string, dict?: { [key: string]: any }, eventListener?: { [key: string]: (e?:any)=>void|Promise<void> }): any {
  const elem = document.createElement(tag);
  addAttributes(elem, dict, eventListener);
  return elem;
}

function cloneElem(elem: any, dict?: { [key: string]: any }, eventListener?: { [key: string]: (e?:any)=>void|Promise<void> }): any {
  const clone = elem.cloneNode(true);
  addAttributes(clone, dict, eventListener);
  return clone;
}

function appendChildAll(to: HTMLElement, arr: Array<any>): HTMLElement {
  for (const obj in arr) {
    to.appendChild(arr[obj]);
  }
  return to;
}

export const miniPandA = createElem("div", { id: "miniPandA" });
miniPandA.classList.add("sidenav");
miniPandA.classList.add("cp_tab");

export const subPandA = createElem("div", { id: "subPandA" });

export const kadaiDiv = createElem("div", { className: "kadai-tab" });
export const settingsDiv = createElem("div", { className: "settings-tab" });

export const hamburger = createElem("div", { className: "loader" }, {"click": toggleMiniPandA});

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace KadaiEntryDom {
  export const checkbox = createElem("input", { type: "checkbox", className: "todo-check" });
  export const label = createElem("label");
  export const title = createElem("p", { className: "kadai-title" });
  export const dueDate = createElem("p", { className: "kadai-date" });
  export const remainTime = createElem("span", { className: "time-remain" });
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace DueGroupDom {
  export const header = createElem("div");
  export const headerTitle = createElem("span", { className: "q" });
  export const container = createElem("div", { className: "sidenav-list" });
  export const body = createElem("div");
  export const lectureName = createElem("a");
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace SettingsDom {
  export const mainDiv = createElem("div", {className: "cp-settings"});
  export const div = createElem("div");
  export const p = createElem("p", {className: "cp-settings-text"});
  export const label = createElem("label");
  export const toggleBtn = createElem("input", { type: "checkbox" });
  export const stringBox = createElem("input", {className: "cp-settings-inputbox" });
  export const inputBox = createElem("input", { type: "number", className: "cp-settings-inputbox" });
  export const span = createElem("span", { className: "slider round" });
}

export { KadaiEntryDom, DueGroupDom, SettingsDom, addAttributes, createElem, cloneElem, appendChildAll };