import { saveHostName } from "./features/storage";
import { createMiniSakai, createMiniSakaiBtn } from "./minisakai";
import { isLoggedIn, miniSakaiReady } from "./utils";
import "../public/css/sakai.scss";

async function main() {
    if (isLoggedIn()) {
        createMiniSakaiBtn();
        createMiniSakai();

        miniSakaiReady();
        await saveHostName(window.location.hostname);
    }
}

main();
