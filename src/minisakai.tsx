import { hamburger, miniSakai } from "./dom";
import React from "react";
import { createRoot } from "react-dom/client";
import { MiniSakaiRoot } from "./components/main";
import { Settings } from "./features/setting/types";

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
    root.render(<MiniSakaiRoot subset={false} hostname={hostname}/>);
}

export const applyColorSettings = (settings: Settings): void => {
    const bodyStyles = document.querySelector(".Mrphs-mainHeader") as HTMLElement;
    for (const colorName of Object.getOwnPropertyNames(settings.color)) {
        // @ts-ignore
        const color = settings.color[colorName];
        bodyStyles.style.setProperty(`--${colorName}`, color);
    }
    bodyStyles.style.setProperty("--textColor", settings.getTextColor());
    bodyStyles.style.setProperty("--bgColor", settings.getBgColor());
    bodyStyles.style.setProperty("--dateColor", settings.getDateColor());
};
