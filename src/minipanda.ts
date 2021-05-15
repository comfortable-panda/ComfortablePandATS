import { Kadai, LectureInfo } from "./kadai";
import {
  nowTime,
  getDaysUntil,
  getTimeRemain,
  createLectureIDMap,
} from "./utils";
import {
  miniPandA,
  hamburger,
  KadaiEntryDom,
  DueGroupDom,
  kadaiDiv,
  settingsDiv,
  createElem,
  appendChildAll,
} from "./dom";
import {
  toggleMiniPandA,
  toggleKadaiTab,
  toggleSettingsTab,
  toggleMemoBox,
  toggleKadaiFinishedFlag,
  addKadaiMemo,
  deleteKadaiMemo,
} from "./eventListener";
import { kadaiFetchedTime, quizFetchedTime } from "./content_script";


function createHanburgerButton(): void {
  const topbar = document.getElementById("mastLogin");
  try {
    topbar?.appendChild(hamburger);
  } catch (e) {
    console.log("could not launch miniPandA.");
  }
}

function createMiniPandA(): void {
  const miniPandALogo = createElem("img", {
    className: "logo",
    alt: "logo",
    src: chrome.extension.getURL("img/logo.png"),
  });

  const miniPandACloseBtn = createElem("a", { href: "#", id: "close_btn", textContent: "×" });
  miniPandACloseBtn.classList.add("closebtn", "q");
  miniPandACloseBtn.addEventListener("click", toggleMiniPandA);

  const kadaiTab = createElem("input", { type: "radio", id: "kadaiTab", name: "cp_tab", checked: true });
  kadaiTab.addEventListener("click", toggleKadaiTab);
  const kadaiTabLabel = createElem("label", { htmlFor: "kadaiTab", innerText: "　課題一覧　" });
  const settingsTab = createElem("input", { type: "radio", id: "settingsTab", name: "cp_tab", checked: false });
  settingsTab.addEventListener("click", toggleSettingsTab);
  const settingsTabLabel = createElem("label", { htmlFor: "settingsTab", innerText: "　詳細設定　" });
  const addMemoButton = createElem("button", { className: "plus-button", innerText: "+" });
  addMemoButton.addEventListener("click", toggleMemoBox, true);

  const kadaiFetchedTimestamp = new Date( (typeof kadaiFetchedTime === "number")? kadaiFetchedTime : nowTime);
  const kadaiFetchedTimeString = createElem("p", { className: "kadai-time" });
  kadaiFetchedTimeString.innerText = "課題取得日時： " + kadaiFetchedTimestamp.toLocaleDateString() + " " + kadaiFetchedTimestamp.getHours() + ":" + ("00" + kadaiFetchedTimestamp.getMinutes()).slice(-2) + ":" + ("00" + kadaiFetchedTimestamp.getSeconds()).slice(-2);
  const quizFetchedTimestamp = new Date((typeof quizFetchedTime === "number")? quizFetchedTime : nowTime);
  const quizFetchedTimeString = createElem("p", { className: "quiz-time" });
  quizFetchedTimeString.innerText = "クイズ取得日時： " + quizFetchedTimestamp.toLocaleDateString() + " " + quizFetchedTimestamp.getHours() + ":" + ("00" + quizFetchedTimestamp.getMinutes()).slice(-2) + ":" + ("00" + quizFetchedTimestamp.getSeconds()).slice(-2);
  appendChildAll(miniPandA, [
    miniPandALogo,
    miniPandACloseBtn,
    kadaiTab,
    kadaiTabLabel,
    settingsTab,
    settingsTabLabel,
    addMemoButton,
    kadaiFetchedTimeString,
    quizFetchedTimeString,
  ]);

  const parent = document.getElementById("pageBody");
  const ref = document.getElementById("toolMenuWrap");

  parent?.insertBefore(miniPandA, ref);
}

function appendMemoBox(lectureIDList: Array<LectureInfo>): void {
  const memoEditBox = createElem("div");
  memoEditBox.classList.add("settingsBox", "addMemoBox");
  memoEditBox.style.display = "none";
  const memoLabel = createElem("label");
  memoLabel.style.display = "block";

  const todoLecLabel = memoLabel.cloneNode(true);
  todoLecLabel.innerText = "講義名";
  const todoLecSelect = createElem("select", { className: "todoLecName" });
  const todoLecOption = createElem("option");

  for (const lecture of lectureIDList) {
    const c_todoLecOption = todoLecOption.cloneNode(true);
    c_todoLecOption.text = lecture.lectureName;
    c_todoLecOption.id = lecture.lectureID;
    todoLecSelect.appendChild(c_todoLecOption);
  }

  todoLecLabel.appendChild(todoLecSelect);

  const todoContentLabel = memoLabel.cloneNode(true);
  todoContentLabel.innerText = "メモ";
  const todoContentInput = createElem("input", { type: "text", className: "todoContent" });
  todoContentLabel.appendChild(todoContentInput);

  const todoDueLabel = memoLabel.cloneNode(true);
  todoDueLabel.innerText = "期限";
  const todoDueInput = createElem("input", { type: "datetime-local", className: "todoDue" });
  todoDueInput.value = new Date(`${new Date().toISOString().substr(0, 16)}-10:00`).toISOString().substr(0, 16);
  todoDueLabel.appendChild(todoDueInput);

  const todoSubmitButton = createElem("button", { type: "submit", id: "todo-add", innerText: "追加" });
  todoSubmitButton.addEventListener("click", addKadaiMemo, true);

  appendChildAll(memoEditBox, [todoLecLabel, todoContentLabel, todoDueLabel, todoSubmitButton]);
  kadaiDiv.appendChild(memoEditBox);
}

function updateMiniPandA(kadaiList: Array<Kadai>, lectureIDList: Array<LectureInfo>): void {
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
      dueGroupLectureName.textContent = "" + lectureIDMap.get(item.lectureID);
      const topSite = item.getTopSite();
      if (topSite != null) {
        dueGroupLectureName.href = topSite;
      }
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
        const deleteBadge = document.createElement("span");
        deleteBadge.className = "del-button";
        deleteBadge.id = kadai.kadaiID;
        deleteBadge.addEventListener("click", deleteKadaiMemo, true);
        deleteBadge.innerText = "×";

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
            kadaiTitle.appendChild(deleteBadge);
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
    appendChildAll(miniPandA, [kadaiDiv, settingsDiv]);
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


function createNavBarNotification(lectureIDList: Array<LectureInfo>, kadaiList: Array<Kadai>): void {
  const defaultTab = document.querySelectorAll(".Mrphs-sitesNav__menuitem");
  const defaultTabCount = Object.keys(defaultTab).length;

  for (const lecture of lectureIDList) {
    for (let j = 3; j < defaultTabCount; j++) {
      // @ts-ignore
      const lectureID = defaultTab[j].getElementsByClassName("link-container")[0].href.match("(https?://[^/]+)/portal/site-reset/([^/]+)")[2];

      const q = kadaiList.findIndex((kadai) => {
        return kadai.lectureID === lectureID;
      });
      if (q !== -1) {
        if (!kadaiList[q].isRead) {
          defaultTab[j].classList.add("red-badge");
        }
        const daysUntilDue = getDaysUntil(nowTime, kadaiList[q].closestDueDateTimestamp * 1000);
        const aTagCount = defaultTab[j].getElementsByTagName("a").length;

        if (daysUntilDue > 0 && daysUntilDue <= 1) {
          defaultTab[j].classList.add("nav-danger");
          for (let i = 0; i < aTagCount; i++) {
            defaultTab[j].getElementsByTagName("a")[i].classList.add("nav-danger");
          }
        } else if (daysUntilDue > 1 && daysUntilDue <= 5) {
          defaultTab[j].classList.add("nav-warning");
          for (let i = 0; i < aTagCount; i++) {
            defaultTab[j].getElementsByTagName("a")[i].classList.add("nav-warning");
          }
        } else if (daysUntilDue > 5 && daysUntilDue <= 14) {
          defaultTab[j].classList.add("nav-safe");
          for (let i = 0; i < aTagCount; i++) {
            defaultTab[j].getElementsByTagName("a")[i].classList.add("nav-safe");
          }
        }
      }
    }
  }
}

export {
  createHanburgerButton,
  createMiniPandA,
  appendMemoBox,
  updateMiniPandA,
  createNavBarNotification,
};
