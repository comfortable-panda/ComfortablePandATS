import React from "react";
import { createRoot } from "react-dom/client";
import { MiniSakaiRoot } from "./components/main";
import { Settings } from "./features/setting/types";

let toggle = false;
/**
 * Change visibility of miniSakai
 */
export const toggleMiniSakai = (): void => {
    if (toggle) {
        // Hide miniSakai
        miniSakai.classList.remove("cs-show");
        miniSakai.classList.add("cs-hide");
        document.getElementById("cs-cover")?.remove();
    } else {
        // Display miniSakai
        miniSakai.classList.remove("cs-hide");
        miniSakai.classList.add("cs-show");
        const cover = document.createElement("div");
        cover.id = "cs-cover";
        document.getElementsByTagName("body")[0].appendChild(cover);
        cover.onclick = toggleMiniSakai;
    }
    toggle = !toggle;
};

export const miniSakai = document.createElement("div");
miniSakai.id = "miniSakai";
miniSakai.classList.add("cs-minisakai", "cs-tab");

export const hamburger = document.createElement("button");
hamburger.className = "cs-loading";
hamburger.addEventListener("click", toggleMiniSakai);

/**
 * Create a button to open miniSakai
 */
export function createMiniSakaiBtn(): void {
    const topbar = document.getElementById("mastLogin");
    try {
        topbar?.appendChild(hamburger);
    } catch (e) {
        console.log("could not launch miniSakai.");
    }
}

/**
 * Insert miniSakai into Sakai.
 */
export function createMiniSakai(hostname: string) {
    const parent = document.getElementsByClassName("Mrphs-mainHeader")[0];
    const ref = document.getElementsByClassName("Mrphs-sites-nav")[0];
    parent?.insertBefore(miniSakai, ref);
    const root = createRoot(miniSakai);
    root.render(<MiniSakaiRoot subset={false} hostname={hostname} />);
}

export const applyColorSettings = (settings: Settings, isSubSakai: boolean): void => {
    let bodyStyles: HTMLElement;
    if (!isSubSakai) {
        bodyStyles = document.querySelector(".Mrphs-mainHeader") as HTMLElement;
    } else {
        bodyStyles = document.querySelector("#subSakai") as HTMLElement;
    }
    for (const colorName of Object.getOwnPropertyNames(settings.color)) {
        // @ts-ignore
        const color = settings.color[colorName];
        bodyStyles.style.setProperty(`--${colorName}`, color);
    }
    bodyStyles.style.setProperty("--textColor", settings.getTextColor());
    bodyStyles.style.setProperty("--bgColor", settings.getBgColor());
    bodyStyles.style.setProperty("--dateColor", settings.getDateColor());
};
