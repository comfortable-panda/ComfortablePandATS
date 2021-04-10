import { saveToStorage } from "./storage";
import { KadaiEntry } from "./kadai";
import { fetchLectureIDs, getKadaiOfLectureID } from "./network";
import { createMiniPandA, updateMiniPandA } from "./minipanda";

const baseURL = "http://35.227.163.2/";

function main() {
  createMiniPandA(100101010);
  const kadai = new KadaiEntry("abc012", "", 12, false, "sa");
  saveToStorage("kadais", [kadai, kadai]);
  console.log("ok panda");

  let lectureIDList = fetchLectureIDs();
  console.log("lecture ID", lectureIDList);
  let kadaiList = [];
  for (let i of lectureIDList[1]) {
    kadaiList.push(getKadaiOfLectureID(baseURL, i.lectureID));
  }
  (Promise as any).allSettled(kadaiList)
    .then((result: any)=>{
      console.log("kadai", result);
      let kadaiList2 = [];
      for (const k of result){
        if (k.status === "fulfilled"){
          kadaiList2.push(k.value)
        }
      }
      console.log("kadaiList", kadaiList2)
      updateMiniPandA(kadaiList2, lectureIDList[1])
    })





}


main();
