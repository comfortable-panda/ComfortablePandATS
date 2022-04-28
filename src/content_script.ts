import { saveHostName } from "./features/storage/save";
import { createMiniSakai, createMiniSakaiBtn } from "./minisakai";
import { isLoggedIn, miniSakaiReady } from "./utils";

async function main() {
    if (isLoggedIn()) {
        createMiniSakaiBtn();
        createMiniSakai();

        miniSakaiReady();
        await saveHostName(window.location.hostname);
    }
}

main();
