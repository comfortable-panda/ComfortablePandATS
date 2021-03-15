import { saveToStorage } from "./storage";
import { KadaiEntry } from "./kadai";
import {fetchLectureIDs, getKadaiOfLectureID} from "./network"
const baseURL = "http://35.227.163.2/"

function main(){

    const kadai = new KadaiEntry("abc012", "", 12, false, "sa");
    saveToStorage("kadais", [kadai,kadai])
    console.log("ok panda")

    let lectureIDList = fetchLectureIDs();
    console.log("lecture ID", lectureIDList)
    let kadaiList = []
    for (let i of lectureIDList[1]){
        kadaiList.push(getKadaiOfLectureID(baseURL, i));
    }
    Promise.all(kadaiList)
        .then((kadai)=>{
            console.log("kadai", kadai);
        })

}

main()