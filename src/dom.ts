import { createElem } from "./utils";
import { toggleMiniPandA } from "./eventListener";

export const miniPandA = createElem("div", { id: "miniPandA" });
miniPandA.classList.add("sidenav");
miniPandA.classList.add("cp_tab");

export const kadaiDiv = createElem("div", { className: "kadai-tab" });
export const examDiv = createElem("div", { className: "exam-tab" });

export const hamburger = createElem("div");
hamburger.className = "loader";
hamburger.addEventListener("click", toggleMiniPandA);

export const defaultTab = document.querySelectorAll('.Mrphs-sitesNav__menuitem');
export const defaultTabCount = Object.keys(defaultTab).length;

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace KadaiEntryDom {
  export const checkbox = createElem("input", { type: "checkbox", className: "todo-check" });
  export const label = createElem("label");
  export const title = createElem("a", { className: "kadai-title" });
  export const dueDate = createElem("p", { className: "kadai-date" });
  export const remainTime = createElem("span", { className: "time-remain" });
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace DueGroupDom {
  export const header = createElem("div");
  export const headerTitle = createElem("span", { className: "q" });
  export const container = createElem("div", { className: "sidenav-list" });
  export const body = createElem("div");
  export const lectureName = createElem("h2");
}

export { KadaiEntryDom, DueGroupDom };
