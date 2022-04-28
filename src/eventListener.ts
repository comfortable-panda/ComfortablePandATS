import { miniSakai } from "./dom";

let toggle = false;

/**
 * Change visibility of miniSakai
 */
function toggleMiniSakai(): void {
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
}

export { toggleMiniSakai };
