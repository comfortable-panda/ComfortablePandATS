function createElem(tag: any, dict: { [key: string]: any }) {
  const elem = document.createElement(tag);
  for (const key in dict) {
    // @ts-ignore
    elem[key] = dict[key];
  }
  return elem;
}

function appendChildAll(to: HTMLElement, arr: Array<any>): HTMLElement {
  for (const obj in arr) {
    to.appendChild(arr[obj]);
  }
  return to;
}

function createButton(): HTMLDivElement {
  const hamburger = document.createElement("div");
  hamburger.className = "loader";
  return hamburger;
}

let toggle = false;
const miniPandA = createElem("div", {id: "miniPandA"});
miniPandA.classList.add("sidenav");
miniPandA.classList.add("cp_tab");

function toggleSideNav() {
  if (toggle) {
    miniPandA.style.width = "0px";
    // @ts-ignore
    document.getElementById("cover").remove();
  } else {
    miniPandA.style.width = "300px";
    const cover = document.createElement("div");
    cover.id = "cover";
    document.getElementsByTagName("body")[0].appendChild(cover);
    cover.onclick = toggleSideNav;
  }
  toggle = !toggle;
}

function createMiniPandA(fetchedTime: number) {
  const hamburger = createButton();
  const topbar = document.getElementById("mastLogin");
  hamburger.addEventListener("click", toggleSideNav);
  try {
    // @ts-ignore
    topbar.appendChild(hamburger);
  } catch (e) {
    console.log("could not launch miniPandA.");
  }

  const miniPandALogo = createElem("img", {className: "logo", alt: "logo", src: chrome.extension.getURL("img/logo.png")});

  const miniPandACloseBtn = createElem("a", {href: "#", id: "close_btn", textContent: "×"});
  miniPandACloseBtn.classList.add("closebtn");
  miniPandACloseBtn.classList.add("q");
  miniPandACloseBtn.addEventListener("click", toggleSideNav);

  const kadaiTab = createElem("input", {type: "radio", id: "kadaiTab", name: "cp_tab", checked: true});
  // kadaiTab.addEventListener('click', toggleKadaiTab);
  const kadaiTabLabel = createElem("label", {htmlFor: "kadaiTab", innerText: "課題一覧"});
  const examTab = createElem("input", {type: "radio", id: "examTab", name: "cp_tab", checked: false});
  // examTab.addEventListener('click', toggleExamTab);
  const examTabLabel = createElem("label", {htmlFor: "examTab", innerText: "テスト・クイズ一覧"});
  const addMemoButton = createElem("button", {className: "plus-button", innerText: "+"});
  // addMemoButton.addEventListener('click', toggleMemoBox, true);

  const fetchedTimestamp = new Date(fetchedTime);
  const fetchedTimeString = createElem("p", {className: "kadai-time"});
  fetchedTimeString.innerText = "取得日時： " + fetchedTimestamp.toLocaleDateString() + " " + fetchedTimestamp.getHours() + ":" + ('00' + fetchedTimestamp.getMinutes()).slice(-2) + ":" + ('00' + fetchedTimestamp.getSeconds()).slice(-2);

  appendChildAll(miniPandA, [
    miniPandALogo,
    miniPandACloseBtn,
    kadaiTab,
    kadaiTabLabel,
    examTab,
    examTabLabel,
    addMemoButton,
    fetchedTimeString,
  ]);

  const parent = document.getElementById("pageBody");
  const ref = document.getElementById("toolMenuWrap");

  // @ts-ignore
  parent.insertBefore(miniPandA, ref);
}




export { createMiniPandA };
