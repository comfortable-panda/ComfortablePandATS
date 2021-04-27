import {loadFromStorage} from './storage'

function dumpCache() {
    const subpandaRoot = document.querySelector("#subpanda");
    if (subpandaRoot == null) return;

    loadFromStorage("TSkadaiList").then(j => {
        subpandaRoot.innerHTML = j;
    });
}

document.addEventListener('load', () => {
    dumpCache();
});
