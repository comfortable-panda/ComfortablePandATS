const MAX_FAVORITES = 10;

function getSiteIdAndHrefLectureNameMap(): Map<string, {href: string, title: string}> {
  const sites = document.querySelectorAll(".fav-sites-entry");
  const map = new Map<string, { href: string; title: string }>();
  sites.forEach(site => {
    const siteId = site.querySelector(".site-favorite-btn")?.getAttribute("data-site-id");
    if (siteId == null) return;
    const href = (site.querySelector(".fav-title")?.childNodes[1] as HTMLAnchorElement).href;
    const title = (site.querySelector(".fav-title")?.childNodes[1] as HTMLAnchorElement).title;
    map.set(siteId, { href: href, title: title });
  });
  return map;
}

// お気に入り上限を超えた講義を topbar に追加する
// ネットワーク通信を行うので注意
function addMissingBookmarkedLectures(): Promise<void> {
  const topnav = document.querySelector("#topnav");
  if (topnav == null) return new Promise((resolve, reject) => resolve());
  const request = new XMLHttpRequest();
  request.open("GET", "https://panda.ecs.kyoto-u.ac.jp/portal/favorites/list");
  request.responseType = "json";
  return new Promise((resolve, reject) => {
    request.addEventListener("load", (e) => {
      const res = request.response;
      if (res == null) {
        console.log("failed to fetch favorites list");
        reject();
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
      resolve();
    });
    request.send();
  });
}

export { addMissingBookmarkedLectures };
