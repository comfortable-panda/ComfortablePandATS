import { saveToStorage } from "./storage";
import { KadaiEntry } from "./kadai";
import { fetchLectureIDs, getKadaiOfLectureID } from "./network";
import { createHanburgerButton, createMiniPandA, updateMiniPandA } from "./minipanda";

const baseURL = "http://35.227.163.2/";

function main() {
  createHanburgerButton();
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
    .then((result: any) => {
      console.log("kadai", result);
      let kadaiList2 = [];
      for (const k of result) {
        if (k.status === "fulfilled") {
          kadaiList2.push(k.value);
        }
      }
      console.log("kadaiList", kadaiList2);
      updateMiniPandA(kadaiList2, lectureIDList[1]);
    });


}

function getSiteIdAndHrefLectureNameMap(): Map<string, { href: string, title: string }> {
  const sites = document.querySelectorAll(".fav-sites-entry");
  const map = new Map<string, { href: string, title: string }>();
  sites.forEach(site => {
    const siteId = site.querySelector(".site-favorite-btn")?.getAttribute("data-site-id");
    if (siteId == null) return;
    const href = (site.querySelector(".fav-title")?.childNodes[1] as HTMLAnchorElement).href;
    const title = (site.querySelector(".fav-title")?.childNodes[1] as HTMLAnchorElement).title;
    map.set(siteId, { href: href, title: title });
  });
  return map;
}

const MAX_FAVORITES = 10;

function addMissingBookmarkedLectures() {
  const topnav = document.querySelector("#topnav");
  if (topnav == null) return;
  const request = new XMLHttpRequest();
  request.open("GET", "https://panda.ecs.kyoto-u.ac.jp/portal/favorites/list");
  request.responseType = "json";
  request.addEventListener("load", (e) => {
    const res = request.response;
    if (res == null) {
      console.log("failed to fetch favorites list");
      return;
    }
    const favorites = res.favoriteSiteIds as [string];
    const sitesInfo = getSiteIdAndHrefLectureNameMap();
    if (favorites.length > MAX_FAVORITES) {
      for (const missingFavoriteId of favorites.slice(MAX_FAVORITES)) {
        const siteInfo = sitesInfo.get(missingFavoriteId);
        if (siteInfo == undefined) continue;
        const href = siteInfo.href;
        const title = siteInfo.title;

        const li = document.createElement("li");
        li.classList.add("Mrphs-sitesNav__menuitem");
        const anchor = document.createElement("a");
        anchor.classList.add("link-container");
        anchor.href = href;
        anchor.title = title;
        const span = document.createElement("span");
        span.innerText = title;
        anchor.appendChild(span);
        li.appendChild(anchor);
        topnav.appendChild(li);
      }
    }
  });
  request.send();
}

main();
addMissingBookmarkedLectures();
