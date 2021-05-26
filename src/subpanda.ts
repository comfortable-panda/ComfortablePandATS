import { appendChildAll, createElem, DueGroupDom, kadaiDiv, KadaiEntryDom, subPandA } from './dom';
import { toggleKadaiFinishedFlag } from './eventListener';
import { Kadai, LectureInfo } from './kadai';
import { loadFromStorage } from './storage'
import {
  convertArrayToKadai,
  createLectureIDMap,
  getDaysUntil,
  getTimeRemain,
  mergeIntoKadaiList,
  nowTime,
  sortKadaiList
} from "./utils";
import {
  VERSION
} from "./content_script"

const subpandaRoot = document.querySelector("#subpanda");

async function dumpCache() {
  if (subpandaRoot == null) return;
  let mergedKadaiList: Array<Kadai>;

  const kadais = await loadFromStorage("TSkadaiList") as Array<Kadai>;
  const quizList = await loadFromStorage("TSQuizList") as Array<Kadai>;
  const kadaiMemoList = convertArrayToKadai(await loadFromStorage("TSkadaiMemoList"));
  mergedKadaiList = mergeIntoKadaiList(kadais, quizList);
  mergedKadaiList = mergeIntoKadaiList(mergedKadaiList, kadaiMemoList);
  const lectureIDs = await loadFromStorage("TSlectureids") as Array<LectureInfo>;
  const fetchedTime = await loadFromStorage("TSkadaiFetchedTime") as number;
  const quizFetchedTime = await loadFromStorage("TSquizFetchedTime") as number;
  updateSubPandA(sortKadaiList(mergedKadaiList), lectureIDs, fetchedTime, quizFetchedTime);
}

function addSubPandAToPopup() {
  if (subpandaRoot == null) return;
  const subPandALogo = createElem("img", {
    className: "subpanda-logo",
    alt: "logo",
    src: chrome.extension.getURL("img/logo.png"),
  });
  appendChildAll(subPandA, [subPandALogo])
  subpandaRoot.appendChild(subPandA);
}

function updateSubPandA(kadaiList: Array<Kadai>, lectureIDList: Array<LectureInfo>, fetchedTime: number, quizFetchedTime: number): void {
  const version = createElem("p", {　classList: "cp-version", innerText: `Version ${VERSION}`});

  const fetchedTimestamp = new Date(fetchedTime);
  const fetchedTimeString = createElem("p", { className: "kadai-time" });
  fetchedTimeString.innerText = "取得日時： " + fetchedTimestamp.toLocaleDateString() + " " + fetchedTimestamp.getHours() + ":" + ("00" + fetchedTimestamp.getMinutes()).slice(-2) + ":" + ("00" + fetchedTimestamp.getSeconds()).slice(-2);
  const quizFetchedTimestamp = new Date((typeof quizFetchedTime === "number")? quizFetchedTime : nowTime);
  const quizFetchedTimeString = createElem("p", { className: "kadai-time" });
  quizFetchedTimeString.innerText = "クイズ取得日時： " + quizFetchedTimestamp.toLocaleDateString() + " " + quizFetchedTimestamp.getHours() + ":" + ("00" + quizFetchedTimestamp.getMinutes()).slice(-2) + ":" + ("00" + quizFetchedTimestamp.getSeconds()).slice(-2);

  const dueGroupHeaderName = ["締め切り２４時間以内", "締め切り５日以内", "締め切り１４日以内", "その他"];
  const dueGroupColor = ["danger", "warning", "success", "other"];
  const initLetter = ["a", "b", "c", "d"];
  const lectureIDMap = createLectureIDMap(lectureIDList);

  // 0: <24h, 1: <5d, 2: <14d, 3: >14d
  for (let i = 0; i < 4; i++) {
    let entryCount = 0;
    // 色別のグループを作成する
    const dueGroupHeader = DueGroupDom.header.cloneNode(true);
    const dueGroupHeaderTitle = DueGroupDom.headerTitle.cloneNode(true);
    dueGroupHeader.className = `sidenav-${dueGroupColor[i]}`;
    dueGroupHeader.style.display = "none";
    dueGroupHeaderTitle.textContent = `${dueGroupHeaderName[i]}`;
    dueGroupHeader.appendChild(dueGroupHeaderTitle);
    const dueGroupContainer = DueGroupDom.container.cloneNode(true);
    dueGroupContainer.classList.add(`sidenav-list-${dueGroupColor[i]}`);
    dueGroupContainer.style.display = "none";

    // 各講義についてループ
    for (const item of kadaiList) {
      // 課題アイテムを入れるやつを作成
      const dueGroupBody = DueGroupDom.body.cloneNode(true);
      dueGroupBody.className = `kadai-${dueGroupColor[i]}`;
      dueGroupBody.id = initLetter[i] + item.lectureID;
      const dueGroupLectureName = DueGroupDom.lectureName.cloneNode(true) as HTMLAnchorElement;
      dueGroupLectureName.classList.add(`lecture-${dueGroupColor[i]}`, "lecture-name")
      dueGroupLectureName.textContent = "" + (lectureIDMap.get(item.lectureID) || "???");
      // const topSite = item.getTopSite();
      // if (topSite != null) {
      //   dueGroupLectureName.href = topSite;
      // }
      dueGroupBody.appendChild(dueGroupLectureName);

      // 各講義の課題一覧についてループ
      let cnt = 0;
      for (const kadai of item.kadaiEntries) {
        let kadaiCheckbox = KadaiEntryDom.checkbox.cloneNode(true);
        const kadaiLabel = KadaiEntryDom.label.cloneNode(true);
        const kadaiDueDate = KadaiEntryDom.dueDate.cloneNode(true);
        const kadaiRemainTime = KadaiEntryDom.remainTime.cloneNode(true);
        const kadaiTitle = KadaiEntryDom.title.cloneNode(true);
        const memoBadge = document.createElement("span");
        memoBadge.classList.add("add-badge", "add-badge-success");
        memoBadge.innerText = "メモ";
        const quizBadge = document.createElement("span");
        quizBadge.classList.add("add-badge", "add-badge-quiz");
        quizBadge.innerText = "クイズ";

        const _date = new Date(kadai.dueDateTimestamp * 1000);
        const dispDue = _date.toLocaleDateString() + " " + _date.getHours() + ":" + ("00" + _date.getMinutes()).slice(-2);
        const timeRemain = getTimeRemain((kadai.dueDateTimestamp * 1000 - nowTime) / 1000);

        const daysUntilDue = getDaysUntil(nowTime, kadai.dueDateTimestamp * 1000);
        if ((daysUntilDue > 0 && daysUntilDue <= 1 && i === 0) || (daysUntilDue > 1 && daysUntilDue <= 5 && i === 1) || (daysUntilDue > 5 && daysUntilDue <= 14 && i === 2) || (daysUntilDue > 14 && i === 3)) {
          kadaiDueDate.textContent = "" + dispDue;
          kadaiRemainTime.textContent = `あと${timeRemain[0]}日${timeRemain[1]}時間${timeRemain[2]}分`;
          kadaiTitle.textContent = "" + kadai.assignmentTitle;
          if (kadai.isFinished) kadaiCheckbox.checked = true;
          kadaiCheckbox.id = kadai.kadaiID;
          kadaiCheckbox.lectureID = item.lectureID;
          kadaiCheckbox.addEventListener("change", toggleKadaiFinishedFlag, false);
          kadaiLabel.htmlFor = kadai.kadaiID;

          if (kadai.isMemo) {
            kadaiTitle.textContent = "";
            kadaiTitle.appendChild(memoBadge);
            kadaiTitle.append(kadai.assignmentTitle);
          }

          if (kadai.isQuiz) {
            kadaiTitle.textContent = "";
            kadaiTitle.appendChild(quizBadge);
            kadaiTitle.append(kadai.assignmentTitle);
          }

          appendChildAll(dueGroupBody, [kadaiCheckbox, kadaiLabel, kadaiDueDate, kadaiRemainTime, kadaiTitle]);
          cnt++;
        }
      }
      // 各講義の課題で該当するものがある場合はグループに追加
      if (cnt > 0) {
        dueGroupContainer.appendChild(dueGroupBody);
        entryCount++;
      }
    }
    if (entryCount > 0) {
      dueGroupHeader.style.display = "";
      dueGroupContainer.style.display = "";
    }
    appendChildAll(subPandA, [version, fetchedTimeString, quizFetchedTimeString, kadaiDiv]);
    appendChildAll(kadaiDiv, [dueGroupHeader, dueGroupContainer]);
  }

  // 何もない時はRelaxPandAを表示する
  if (kadaiList.length === 0) {
    const kadaiTab = kadaiDiv;
    const relaxDiv = createElem("div", { className: "relaxpanda" });
    const relaxPandaP = createElem("p", { className: "relaxpanda-p", innerText: "現在表示できる課題はありません" });
    const relaxPandaImg = createElem("img", {
      className: "relaxpanda-img",
      alt: "logo",
      src: chrome.extension.getURL("img/relaxPanda.png"),
    });
    appendChildAll(relaxDiv, [relaxPandaP, relaxPandaImg]);
    kadaiTab.appendChild(relaxDiv);
  }
}

function initSubPandA() {
  addSubPandAToPopup();
  dumpCache();
}

initSubPandA();
