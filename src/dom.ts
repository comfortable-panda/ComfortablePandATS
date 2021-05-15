import { toggleMiniPandA } from "./eventListener";

function createElem(tag: string, dict?: { [key: string]: any }): any {
  const elem = document.createElement(tag);
  for (const key in dict) {
    // @ts-ignore
    elem[key] = dict[key];
  }
  return elem;
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

export const hamburger = createElem("div");
hamburger.className = "loader";
hamburger.addEventListener("click", toggleMiniPandA);

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

export { KadaiEntryDom, DueGroupDom, createElem, appendChildAll };
