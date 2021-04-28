import { Kadai } from './kadai';
import {loadFromStorage} from './storage'

async function dumpCache() {
    const subpandaRoot = document.querySelector("#subpanda");
    if (subpandaRoot == null) return;

    const kadais = await loadFromStorage("TSkadaiList") as Array<Kadai>;
    let textToShow = "";
    for (const kadai of kadais) {
        textToShow += kadai.lectureID + "\n";
        for (const entry of kadai.kadaiEntries) {
            textToShow += "\t" + entry.assignmentTitle + " : " + entry.dueDateTimestamp + "\n";
        }
    }    

    subpandaRoot.innerHTML = textToShow;
}

dumpCache();
