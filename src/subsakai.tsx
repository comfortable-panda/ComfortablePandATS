import { loadHostName } from "./features/storage";
import { createRoot } from "react-dom/client";
import React from "react";
import { MiniSakaiRoot } from "./components/main";

/**
 * Initialize subSakai
 */
async function initSubSakai() {
    const hostname = await loadHostName();
    if (hostname === undefined) {
        console.warn("could not initialize subsakai");
        return;
    }

    const domRoot = document.querySelector("#subSakai");
    if (domRoot === null) {
        console.warn("could not find #subSakai");
        return;
    }
    const root = createRoot(domRoot);
    root.render(<MiniSakaiRoot subset={true} hostname={hostname} />);
}

initSubSakai();
