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

/**
 * Edit default message of favorites tab.
 */
async function editFavoritesMessage(): Promise<void> {
    // Wait 200ms until jQuery finished generating message.
    await new Promise((r) => setTimeout(r, 200));
    try {
        const message = document.getElementsByClassName("favorites-max-marker")[0];
        message.innerHTML = `<i class='fa fa-bell warning-icon'></i>${
            chrome.runtime.getManifest().name
        }によってお気に入り登録した<br>サイトが全てバーに追加されました。`;
        const lectureTabs = document.getElementsByClassName("fav-sites-entry");
        const lectureTabsCount = lectureTabs.length;
        for (let i = 0; i < lectureTabsCount; i++) {
            lectureTabs[i].classList.remove("site-favorite-is-past-max");
        }
    } catch (e) {
        console.log("could not edit message");
    }
}

export { toggleMiniSakai, editFavoritesMessage };
