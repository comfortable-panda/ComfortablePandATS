/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/bookmark.ts":
/*!*************************!*\
  !*** ./src/bookmark.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addMissingBookmarkedLectures = void 0;
var eventListener_1 = __webpack_require__(/*! ./eventListener */ "./src/eventListener.ts");
var MAX_FAVORITES = 10;
function getSiteIdAndHrefLectureNameMap() {
    var sites = document.querySelectorAll(".fav-sites-entry");
    var map = new Map();
    sites.forEach(function (site) {
        var _a, _b, _c;
        var siteId = (_a = site.querySelector(".site-favorite-btn")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-site-id");
        if (siteId == null)
            return;
        var href = ((_b = site.querySelector(".fav-title")) === null || _b === void 0 ? void 0 : _b.childNodes[1]).href;
        var title = ((_c = site.querySelector(".fav-title")) === null || _c === void 0 ? void 0 : _c.childNodes[1]).title;
        map.set(siteId, { href: href, title: title });
    });
    return map;
}
function isCurrentSite(siteId) {
    var currentSiteIdM = window.location.href.match(/https?:\/\/panda\.ecs\.kyoto-u\.ac\.jp\/portal\/site\/([^\/]+)/);
    if (currentSiteIdM == null)
        return false;
    return currentSiteIdM[1] == siteId;
}
// お気に入り上限を超えた講義を topbar に追加する
// ネットワーク通信を行うので注意
function addMissingBookmarkedLectures() {
    var topnav = document.querySelector("#topnav");
    if (topnav == null)
        return new Promise(function (resolve, reject) { return resolve(); });
    var request = new XMLHttpRequest();
    request.open("GET", "https://panda.ecs.kyoto-u.ac.jp/portal/favorites/list");
    request.responseType = "json";
    // @ts-ignore
    document.querySelector(".organizeFavorites").addEventListener("click", eventListener_1.editFavTabMessage);
    return new Promise(function (resolve, reject) {
        request.addEventListener("load", function (e) {
            var res = request.response;
            if (res == null) {
                console.log("failed to fetch favorites list");
                reject();
            }
            var favorites = res.favoriteSiteIds;
            var sitesInfo = getSiteIdAndHrefLectureNameMap();
            if (favorites.length > MAX_FAVORITES) {
                for (var _i = 0, _a = favorites.slice(MAX_FAVORITES); _i < _a.length; _i++) {
                    var missingFavoriteId = _a[_i];
                    if (isCurrentSite(missingFavoriteId))
                        continue;
                    var siteInfo = sitesInfo.get(missingFavoriteId);
                    if (siteInfo == undefined)
                        continue;
                    var href = siteInfo.href;
                    var title = siteInfo.title;
                    var li = document.createElement("li");
                    li.classList.add("Mrphs-sitesNav__menuitem");
                    var anchor = document.createElement("a");
                    anchor.classList.add("link-container");
                    anchor.href = href;
                    anchor.title = title;
                    var span = document.createElement("span");
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
exports.addMissingBookmarkedLectures = addMissingBookmarkedLectures;


/***/ }),

/***/ "./src/content_script.ts":
/*!*******************************!*\
  !*** ./src/content_script.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.displayMiniPandA = exports.mergedKadaiListNoMemo = exports.mergedKadaiList = exports.lectureIDList = exports.fetchedTime = void 0;
var storage_1 = __webpack_require__(/*! ./storage */ "./src/storage.ts");
var network_1 = __webpack_require__(/*! ./network */ "./src/network.ts");
var minipanda_1 = __webpack_require__(/*! ./minipanda */ "./src/minipanda.ts");
var bookmark_1 = __webpack_require__(/*! ./bookmark */ "./src/bookmark.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var baseURL = "https://panda.ecs.kyoto-u.ac.jp";
function loadAndMergeKadaiList(lectureIDList, useCache) {
    return __awaiter(this, void 0, void 0, function () {
        var oldKadaiList, newKadaiList, pendingList, _i, lectureIDList_1, i, result, _a, result_1, k, kadaiMemoList, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, storage_1.loadFromStorage("TSkadaiList")];
                case 1:
                    oldKadaiList = _c.sent();
                    newKadaiList = [];
                    if (!useCache) return [3 /*break*/, 4];
                    console.log("キャッシュなし");
                    pendingList = [];
                    // 課題取得待ちリストに追加
                    for (_i = 0, lectureIDList_1 = lectureIDList; _i < lectureIDList_1.length; _i++) {
                        i = lectureIDList_1[_i];
                        pendingList.push(network_1.getKadaiOfLectureID(baseURL, i.lectureID));
                    }
                    return [4 /*yield*/, Promise.allSettled(pendingList)];
                case 2:
                    result = _c.sent();
                    for (_a = 0, result_1 = result; _a < result_1.length; _a++) {
                        k = result_1[_a];
                        if (k.status === "fulfilled")
                            newKadaiList.push(k.value);
                    }
                    // 取得した時間を保存
                    return [4 /*yield*/, storage_1.saveToStorage("TSfetchedTime", utils_1.nowTime)];
                case 3:
                    // 取得した時間を保存
                    _c.sent();
                    // 保存してあったものとマージする
                    exports.mergedKadaiListNoMemo = utils_1.compareAndMergeKadaiList(oldKadaiList, newKadaiList);
                    exports.mergedKadaiList = utils_1.compareAndMergeKadaiList(oldKadaiList, newKadaiList);
                    return [3 /*break*/, 5];
                case 4:
                    console.log("キャッシュあり");
                    exports.mergedKadaiListNoMemo = utils_1.compareAndMergeKadaiList(oldKadaiList, oldKadaiList);
                    exports.mergedKadaiList = utils_1.compareAndMergeKadaiList(oldKadaiList, oldKadaiList);
                    _c.label = 5;
                case 5: 
                // マージ後のkadaiListをストレージに保存する
                return [4 /*yield*/, storage_1.saveToStorage("TSkadaiList", exports.mergedKadaiListNoMemo)];
                case 6:
                    // マージ後のkadaiListをストレージに保存する
                    _c.sent();
                    _b = utils_1.convertArrayToKadai;
                    return [4 /*yield*/, storage_1.loadFromStorage("TSkadaiMemoList")];
                case 7:
                    kadaiMemoList = _b.apply(void 0, [_c.sent()]);
                    // さらにメモもマージする
                    exports.mergedKadaiList = utils_1.mergeMemoIntoKadaiList(exports.mergedKadaiList, kadaiMemoList);
                    return [2 /*return*/, exports.mergedKadaiList];
            }
        });
    });
}
function displayMiniPandA(mergedKadaiList, lectureIDList, fetchedTime) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            minipanda_1.createMiniPandA(utils_1.useCache(fetchedTime) ? utils_1.nowTime : fetchedTime);
            minipanda_1.appendMemoBox(lectureIDList);
            minipanda_1.updateMiniPandA(mergedKadaiList, lectureIDList);
            return [2 /*return*/];
        });
    });
}
exports.displayMiniPandA = displayMiniPandA;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!utils_1.isLoggedIn()) return [3 /*break*/, 5];
                    minipanda_1.createHanburgerButton();
                    return [4 /*yield*/, storage_1.loadFromStorage("TSfetchedTime")];
                case 1:
                    exports.fetchedTime = _a.sent();
                    exports.lectureIDList = network_1.fetchLectureIDs()[1];
                    return [4 /*yield*/, loadAndMergeKadaiList(exports.lectureIDList, utils_1.useCache(exports.fetchedTime))];
                case 2:
                    exports.mergedKadaiList = _a.sent();
                    return [4 /*yield*/, displayMiniPandA(exports.mergedKadaiList, exports.lectureIDList, exports.fetchedTime)];
                case 3:
                    _a.sent();
                    utils_1.miniPandAReady();
                    utils_1.updateIsReadFlag(exports.mergedKadaiListNoMemo);
                    return [4 /*yield*/, bookmark_1.addMissingBookmarkedLectures()];
                case 4:
                    _a.sent();
                    minipanda_1.createNavBarNotification(exports.lectureIDList, exports.mergedKadaiList);
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
main();


/***/ }),

/***/ "./src/dom.ts":
/*!********************!*\
  !*** ./src/dom.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.appendChildAll = exports.createElem = exports.DueGroupDom = exports.KadaiEntryDom = exports.hamburger = exports.examDiv = exports.kadaiDiv = exports.miniPandA = void 0;
var eventListener_1 = __webpack_require__(/*! ./eventListener */ "./src/eventListener.ts");
function createElem(tag, dict) {
    var elem = document.createElement(tag);
    for (var key in dict) {
        // @ts-ignore
        elem[key] = dict[key];
    }
    return elem;
}
exports.createElem = createElem;
function appendChildAll(to, arr) {
    for (var obj in arr) {
        to.appendChild(arr[obj]);
    }
    return to;
}
exports.appendChildAll = appendChildAll;
exports.miniPandA = createElem("div", { id: "miniPandA" });
exports.miniPandA.classList.add("sidenav");
exports.miniPandA.classList.add("cp_tab");
exports.kadaiDiv = createElem("div", { className: "kadai-tab" });
exports.examDiv = createElem("div", { className: "exam-tab" });
exports.hamburger = createElem("div");
exports.hamburger.className = "loader";
exports.hamburger.addEventListener("click", eventListener_1.toggleMiniPandA);
// eslint-disable-next-line @typescript-eslint/no-namespace
var KadaiEntryDom;
(function (KadaiEntryDom) {
    KadaiEntryDom.checkbox = createElem("input", { type: "checkbox", className: "todo-check" });
    KadaiEntryDom.label = createElem("label");
    KadaiEntryDom.title = createElem("p", { className: "kadai-title" });
    KadaiEntryDom.dueDate = createElem("p", { className: "kadai-date" });
    KadaiEntryDom.remainTime = createElem("span", { className: "time-remain" });
})(KadaiEntryDom || (KadaiEntryDom = {}));
exports.KadaiEntryDom = KadaiEntryDom;
// eslint-disable-next-line @typescript-eslint/no-namespace
var DueGroupDom;
(function (DueGroupDom) {
    DueGroupDom.header = createElem("div");
    DueGroupDom.headerTitle = createElem("span", { className: "q" });
    DueGroupDom.container = createElem("div", { className: "sidenav-list" });
    DueGroupDom.body = createElem("div");
    DueGroupDom.lectureName = createElem("a");
})(DueGroupDom || (DueGroupDom = {}));
exports.DueGroupDom = DueGroupDom;


/***/ }),

/***/ "./src/eventListener.ts":
/*!******************************!*\
  !*** ./src/eventListener.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.editFavTabMessage = exports.deleteKadaiMemo = exports.addKadaiMemo = exports.toggleKadaiFinishedFlag = exports.toggleMemoBox = exports.toggleExamTab = exports.toggleKadaiTab = exports.toggleMiniPandA = void 0;
var dom_1 = __webpack_require__(/*! ./dom */ "./src/dom.ts");
var storage_1 = __webpack_require__(/*! ./storage */ "./src/storage.ts");
var kadai_1 = __webpack_require__(/*! ./kadai */ "./src/kadai.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var content_script_1 = __webpack_require__(/*! ./content_script */ "./src/content_script.ts");
var toggle = false;
function toggleMiniPandA() {
    var _a;
    // miniPandAを表示・非表示にします
    if (toggle) {
        dom_1.miniPandA.style.width = "0px";
        (_a = document.getElementById("cover")) === null || _a === void 0 ? void 0 : _a.remove();
    }
    else {
        dom_1.miniPandA.style.width = "300px";
        var cover = document.createElement("div");
        cover.id = "cover";
        document.getElementsByTagName("body")[0].appendChild(cover);
        cover.onclick = toggleMiniPandA;
    }
    toggle = !toggle;
}
exports.toggleMiniPandA = toggleMiniPandA;
function toggleKadaiTab() {
    // 課題一覧タブの表示・非表示をします
    var kadaiTab = document.querySelector(".kadai-tab");
    // @ts-ignore
    kadaiTab.style.display = "";
    var examTab = document.querySelector(".exam-tab");
    // @ts-ignore
    examTab.style.display = "none";
    var addMemoButton = document.querySelector(".plus-button");
    // @ts-ignore
    addMemoButton.style.display = "";
    var lastKadaiGetTime = document.querySelector(".kadai-time");
    // @ts-ignore
    lastKadaiGetTime.style.display = "";
}
exports.toggleKadaiTab = toggleKadaiTab;
function toggleExamTab() {
    // クイズ・小テスト・試験一覧タブを表示・非表示にします
    var kadaiTab = document.querySelector(".kadai-tab");
    // @ts-ignore
    kadaiTab.style.display = "none";
    var examTab = document.querySelector(".exam-tab");
    // @ts-ignore
    examTab.style.display = "";
    var addMemoButton = document.querySelector(".plus-button");
    // @ts-ignore
    addMemoButton.style.display = "none";
    var lastKadaiGetTime = document.querySelector(".kadai-time");
    // @ts-ignore
    lastKadaiGetTime.style.display = "none";
}
exports.toggleExamTab = toggleExamTab;
function toggleMemoBox() {
    // メモ追加のボックスを表示・非表示にします
    var addMemoBox = document.querySelector(".addMemoBox");
    // @ts-ignore
    var toggleStatus = addMemoBox.style.display;
    if (toggleStatus === "") {
        // @ts-ignore
        addMemoBox.style.display = "none";
    }
    else {
        // @ts-ignore
        addMemoBox.style.display = "";
    }
}
exports.toggleMemoBox = toggleMemoBox;
function toggleKadaiFinishedFlag(event) {
    return __awaiter(this, void 0, void 0, function () {
        var kadaiID, kadaiList, _a, _b, updatedKadaiList, _i, kadaiList_1, kadai, updatedKadaiEntries, _c, _d, kadaiEntry, isFinished;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    kadaiID = event.target.id;
                    if (!(kadaiID[0] === "m")) return [3 /*break*/, 2];
                    _a = utils_1.convertArrayToKadai;
                    return [4 /*yield*/, storage_1.loadFromStorage("TSkadaiMemoList")];
                case 1:
                    kadaiList = _a.apply(void 0, [_e.sent()]);
                    return [3 /*break*/, 4];
                case 2:
                    _b = utils_1.convertArrayToKadai;
                    return [4 /*yield*/, storage_1.loadFromStorage("TSkadaiList")];
                case 3:
                    kadaiList = _b.apply(void 0, [_e.sent()]);
                    _e.label = 4;
                case 4:
                    updatedKadaiList = [];
                    for (_i = 0, kadaiList_1 = kadaiList; _i < kadaiList_1.length; _i++) {
                        kadai = kadaiList_1[_i];
                        updatedKadaiEntries = [];
                        for (_c = 0, _d = kadai.kadaiEntries; _c < _d.length; _c++) {
                            kadaiEntry = _d[_c];
                            if (kadaiEntry.kadaiID === kadaiID) {
                                isFinished = kadaiEntry.isFinished;
                                updatedKadaiEntries.push(new kadai_1.KadaiEntry(kadaiEntry.kadaiID, kadaiEntry.assignmentTitle, kadaiEntry.dueDateTimestamp, kadaiEntry.isMemo, !isFinished, kadaiEntry.assignmentDetail));
                            }
                            else {
                                updatedKadaiEntries.push(kadaiEntry);
                            }
                        }
                        updatedKadaiList.push(new kadai_1.Kadai(kadai.lectureID, kadai.lectureName, updatedKadaiEntries, kadai.isRead));
                    }
                    if (kadaiID[0] === "m")
                        storage_1.saveToStorage("TSkadaiMemoList", updatedKadaiList);
                    else
                        storage_1.saveToStorage("TSkadaiList", updatedKadaiList);
                    return [2 /*return*/];
            }
        });
    });
}
exports.toggleKadaiFinishedFlag = toggleKadaiFinishedFlag;
function addKadaiMemo() {
    return __awaiter(this, void 0, void 0, function () {
        var selectedIdx, todoLecID, todoContent, todoDue, todoTimestamp, kadaiMemoList, kadaiMemoEntry, kadaiMemo, idx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selectedIdx = document.querySelector(".todoLecName").selectedIndex;
                    todoLecID = document.querySelector(".todoLecName").options[selectedIdx].id;
                    todoContent = document.querySelector(".todoContent").value;
                    todoDue = document.querySelector(".todoDue").value;
                    todoTimestamp = new Date("" + todoDue).getTime() / 1000;
                    return [4 /*yield*/, storage_1.loadFromStorage("TSkadaiMemoList")];
                case 1:
                    kadaiMemoList = _a.sent();
                    kadaiMemoEntry = new kadai_1.KadaiEntry(utils_1.genUniqueStr(), todoContent, todoTimestamp, true, false, "");
                    kadaiMemo = new kadai_1.Kadai(todoLecID, todoLecID, [kadaiMemoEntry], true);
                    if (typeof kadaiMemoList !== "undefined" && kadaiMemoList.length > 0) {
                        kadaiMemoList = utils_1.convertArrayToKadai(kadaiMemoList);
                        idx = kadaiMemoList.findIndex(function (oldKadaiMemo) {
                            return (oldKadaiMemo.lectureID === todoLecID);
                        });
                        if (idx !== -1) {
                            kadaiMemoList[idx].kadaiEntries.push(kadaiMemoEntry);
                        }
                        else {
                            kadaiMemoList.push(kadaiMemo);
                        }
                    }
                    else {
                        kadaiMemoList = [kadaiMemo];
                    }
                    storage_1.saveToStorage("TSkadaiMemoList", kadaiMemoList);
                    while (dom_1.miniPandA.firstChild) {
                        dom_1.miniPandA.removeChild(dom_1.miniPandA.firstChild);
                    }
                    while (dom_1.kadaiDiv.firstChild) {
                        dom_1.kadaiDiv.removeChild(dom_1.kadaiDiv.firstChild);
                    }
                    dom_1.miniPandA.remove();
                    dom_1.kadaiDiv.remove();
                    return [4 /*yield*/, content_script_1.displayMiniPandA(utils_1.mergeMemoIntoKadaiList(content_script_1.mergedKadaiListNoMemo, kadaiMemoList), content_script_1.lectureIDList, content_script_1.fetchedTime)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.addKadaiMemo = addKadaiMemo;
function deleteKadaiMemo(event) {
    return __awaiter(this, void 0, void 0, function () {
        var kadaiID, kadaiMemoList, _a, deletedKadaiMemoList, _i, kadaiMemoList_1, kadaiMemo, kadaiMemoEntries, _b, _c, _kadaiMemoEntry;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    kadaiID = event.target.id;
                    _a = utils_1.convertArrayToKadai;
                    return [4 /*yield*/, storage_1.loadFromStorage("TSkadaiMemoList")];
                case 1:
                    kadaiMemoList = _a.apply(void 0, [_d.sent()]);
                    deletedKadaiMemoList = [];
                    for (_i = 0, kadaiMemoList_1 = kadaiMemoList; _i < kadaiMemoList_1.length; _i++) {
                        kadaiMemo = kadaiMemoList_1[_i];
                        kadaiMemoEntries = [];
                        for (_b = 0, _c = kadaiMemo.kadaiEntries; _b < _c.length; _b++) {
                            _kadaiMemoEntry = _c[_b];
                            if (_kadaiMemoEntry.kadaiID !== kadaiID)
                                kadaiMemoEntries.push(_kadaiMemoEntry);
                        }
                        deletedKadaiMemoList.push(new kadai_1.Kadai(kadaiMemo.lectureID, kadaiMemo.lectureName, kadaiMemoEntries, kadaiMemo.isRead));
                    }
                    while (dom_1.miniPandA.firstChild) {
                        dom_1.miniPandA.removeChild(dom_1.miniPandA.firstChild);
                    }
                    while (dom_1.kadaiDiv.firstChild) {
                        dom_1.kadaiDiv.removeChild(dom_1.kadaiDiv.firstChild);
                    }
                    dom_1.miniPandA.remove();
                    dom_1.kadaiDiv.remove();
                    storage_1.saveToStorage("TSkadaiMemoList", deletedKadaiMemoList);
                    return [4 /*yield*/, content_script_1.displayMiniPandA(utils_1.mergeMemoIntoKadaiList(content_script_1.mergedKadaiListNoMemo, deletedKadaiMemoList), content_script_1.lectureIDList, content_script_1.fetchedTime)];
                case 2:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.deleteKadaiMemo = deleteKadaiMemo;
function editFavTabMessage() {
    return __awaiter(this, void 0, void 0, function () {
        var message, lectureTabs, lectureTabsCount, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 200); })];
                case 1:
                    _a.sent();
                    try {
                        message = document.getElementsByClassName("favorites-max-marker")[0];
                        message.innerHTML =
                            '<i class="fa fa-bell warning-icon"></i>ComfortablePandAによってお気に入り登録した<br>サイトが全てバーに追加されました。';
                        lectureTabs = document.getElementsByClassName("fav-sites-entry");
                        lectureTabsCount = lectureTabs.length;
                        for (i = 0; i < lectureTabsCount; i++) {
                            lectureTabs[i].classList.remove("site-favorite-is-past-max");
                        }
                    }
                    catch (e) {
                        console.log("could not edit message");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.editFavTabMessage = editFavTabMessage;


/***/ }),

/***/ "./src/kadai.ts":
/*!**********************!*\
  !*** ./src/kadai.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LectureInfo = exports.Kadai = exports.KadaiEntry = void 0;
var KadaiEntry = /** @class */ (function () {
    function KadaiEntry(kadaiID, assignmentTitle, dueDateTimestamp, isMemo, isFinished, assignmentDetail) {
        this.kadaiID = kadaiID;
        this.assignmentTitle = assignmentTitle;
        this.assignmentDetail = assignmentDetail;
        this.dueDateTimestamp = dueDateTimestamp;
        this.isMemo = isMemo;
        this.isFinished = isFinished;
    }
    return KadaiEntry;
}());
exports.KadaiEntry = KadaiEntry;
var Kadai = /** @class */ (function () {
    function Kadai(lectureID, lectureName, kadaiEntries, isRead) {
        this.lectureID = lectureID;
        this.lectureName = lectureName;
        this.kadaiEntries = kadaiEntries;
        this.isRead = isRead;
    }
    Object.defineProperty(Kadai.prototype, "closestDueDateTimestamp", {
        get: function () {
            if (this.kadaiEntries.length == 0)
                return -1;
            var min = this.kadaiEntries[0].dueDateTimestamp;
            for (var _i = 0, _a = this.kadaiEntries; _i < _a.length; _i++) {
                var entry = _a[_i];
                if (min > entry.dueDateTimestamp) {
                    min = entry.dueDateTimestamp;
                }
            }
            return min;
        },
        enumerable: false,
        configurable: true
    });
    Kadai.prototype.getTopSite = function () {
        for (var _i = 0, _a = this.kadaiEntries; _i < _a.length; _i++) {
            var entry = _a[_i];
            if (entry.kadaiPage != null)
                return entry.kadaiPage;
        }
        return null;
    };
    return Kadai;
}());
exports.Kadai = Kadai;
var LectureInfo = /** @class */ (function () {
    function LectureInfo(tabType, lectureID, lectureName) {
        this.tabType = tabType;
        this.lectureID = lectureID;
        this.lectureName = lectureName;
    }
    return LectureInfo;
}());
exports.LectureInfo = LectureInfo;


/***/ }),

/***/ "./src/minipanda.ts":
/*!**************************!*\
  !*** ./src/minipanda.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createNavBarNotification = exports.updateMiniPandA = exports.appendMemoBox = exports.createMiniPandA = exports.createHanburgerButton = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var dom_1 = __webpack_require__(/*! ./dom */ "./src/dom.ts");
var eventListener_1 = __webpack_require__(/*! ./eventListener */ "./src/eventListener.ts");
function createHanburgerButton() {
    var topbar = document.getElementById("mastLogin");
    try {
        topbar === null || topbar === void 0 ? void 0 : topbar.appendChild(dom_1.hamburger);
    }
    catch (e) {
        console.log("could not launch miniPandA.");
    }
}
exports.createHanburgerButton = createHanburgerButton;
function createMiniPandA(fetchedTime) {
    var miniPandALogo = dom_1.createElem("img", {
        className: "logo",
        alt: "logo",
        src: chrome.extension.getURL("img/logo.png"),
    });
    var miniPandACloseBtn = dom_1.createElem("a", { href: "#", id: "close_btn", textContent: "×" });
    miniPandACloseBtn.classList.add("closebtn", "q");
    miniPandACloseBtn.addEventListener("click", eventListener_1.toggleMiniPandA);
    var kadaiTab = dom_1.createElem("input", { type: "radio", id: "kadaiTab", name: "cp_tab", checked: true });
    kadaiTab.addEventListener("click", eventListener_1.toggleKadaiTab);
    var kadaiTabLabel = dom_1.createElem("label", { htmlFor: "kadaiTab", innerText: "課題一覧" });
    var examTab = dom_1.createElem("input", { type: "radio", id: "examTab", name: "cp_tab", checked: false });
    examTab.addEventListener("click", eventListener_1.toggleExamTab);
    var examTabLabel = dom_1.createElem("label", { htmlFor: "examTab", innerText: "テスト・クイズ一覧" });
    var addMemoButton = dom_1.createElem("button", { className: "plus-button", innerText: "+" });
    addMemoButton.addEventListener("click", eventListener_1.toggleMemoBox, true);
    var fetchedTimestamp = new Date(fetchedTime);
    var fetchedTimeString = dom_1.createElem("p", { className: "kadai-time" });
    fetchedTimeString.innerText = "取得日時： " + fetchedTimestamp.toLocaleDateString() + " " + fetchedTimestamp.getHours() + ":" + ("00" + fetchedTimestamp.getMinutes()).slice(-2) + ":" + ("00" + fetchedTimestamp.getSeconds()).slice(-2);
    dom_1.appendChildAll(dom_1.miniPandA, [
        miniPandALogo,
        miniPandACloseBtn,
        kadaiTab,
        kadaiTabLabel,
        examTab,
        examTabLabel,
        addMemoButton,
        fetchedTimeString
    ]);
    var parent = document.getElementById("pageBody");
    var ref = document.getElementById("toolMenuWrap");
    parent === null || parent === void 0 ? void 0 : parent.insertBefore(dom_1.miniPandA, ref);
}
exports.createMiniPandA = createMiniPandA;
function appendMemoBox(lectureIDList) {
    var memoEditBox = dom_1.createElem("div");
    memoEditBox.classList.add("examBox", "addMemoBox");
    memoEditBox.style.display = "none";
    var memoLabel = dom_1.createElem("label");
    memoLabel.style.display = "block";
    var todoLecLabel = memoLabel.cloneNode(true);
    todoLecLabel.innerText = "講義名";
    var todoLecSelect = dom_1.createElem("select", { className: "todoLecName" });
    var todoLecOption = dom_1.createElem("option");
    for (var _i = 0, lectureIDList_1 = lectureIDList; _i < lectureIDList_1.length; _i++) {
        var lecture = lectureIDList_1[_i];
        var c_todoLecOption = todoLecOption.cloneNode(true);
        c_todoLecOption.text = lecture.lectureName;
        c_todoLecOption.id = lecture.lectureID;
        todoLecSelect.appendChild(c_todoLecOption);
    }
    todoLecLabel.appendChild(todoLecSelect);
    var todoContentLabel = memoLabel.cloneNode(true);
    todoContentLabel.innerText = "メモ";
    var todoContentInput = dom_1.createElem("input", { type: "text", className: "todoContent" });
    todoContentLabel.appendChild(todoContentInput);
    var todoDueLabel = memoLabel.cloneNode(true);
    todoDueLabel.innerText = "期限";
    var todoDueInput = dom_1.createElem("input", { type: "datetime-local", className: "todoDue" });
    todoDueInput.value = new Date(new Date().toISOString().substr(0, 16) + "-10:00").toISOString().substr(0, 16);
    todoDueLabel.appendChild(todoDueInput);
    var todoSubmitButton = dom_1.createElem("button", { type: "submit", id: "todo-add", innerText: "追加" });
    todoSubmitButton.addEventListener("click", eventListener_1.addKadaiMemo, true);
    dom_1.appendChildAll(memoEditBox, [todoLecLabel, todoContentLabel, todoDueLabel, todoSubmitButton]);
    dom_1.kadaiDiv.appendChild(memoEditBox);
}
exports.appendMemoBox = appendMemoBox;
function updateMiniPandA(kadaiList, lectureIDList) {
    var dueGroupHeaderName = ["締め切り２４時間以内", "締め切り５日以内", "締め切り１４日以内", "その他"];
    var dueGroupColor = ["danger", "warning", "success", "other"];
    var initLetter = ["a", "b", "c", "d"];
    var lectureIDMap = utils_1.createLectureIDMap(lectureIDList);
    // 0: <24h, 1: <5d, 2: <14d, 3: >14d
    for (var i = 0; i < 4; i++) {
        var entryCount = 0;
        // 色別のグループを作成する
        var dueGroupHeader = dom_1.DueGroupDom.header.cloneNode(true);
        var dueGroupHeaderTitle = dom_1.DueGroupDom.headerTitle.cloneNode(true);
        dueGroupHeader.className = "sidenav-" + dueGroupColor[i];
        dueGroupHeader.style.display = "none";
        dueGroupHeaderTitle.textContent = "" + dueGroupHeaderName[i];
        dueGroupHeader.appendChild(dueGroupHeaderTitle);
        var dueGroupContainer = dom_1.DueGroupDom.container.cloneNode(true);
        dueGroupContainer.classList.add("sidenav-list-" + dueGroupColor[i]);
        dueGroupContainer.style.display = "none";
        // 各講義についてループ
        for (var _i = 0, kadaiList_1 = kadaiList; _i < kadaiList_1.length; _i++) {
            var item = kadaiList_1[_i];
            // 課題アイテムを入れるやつを作成
            var dueGroupBody = dom_1.DueGroupDom.body.cloneNode(true);
            dueGroupBody.className = "kadai-" + dueGroupColor[i];
            dueGroupBody.id = initLetter[i] + item.lectureID;
            var dueGroupLectureName = dom_1.DueGroupDom.lectureName.cloneNode(true);
            dueGroupLectureName.classList.add("lecture-" + dueGroupColor[i], "lecture-name");
            dueGroupLectureName.textContent = "" + lectureIDMap.get(item.lectureID);
            var topSite = item.getTopSite();
            if (topSite != null) {
                dueGroupLectureName.href = topSite;
            }
            dueGroupBody.appendChild(dueGroupLectureName);
            // 各講義の課題一覧についてループ
            var cnt = 0;
            for (var _a = 0, _b = item.kadaiEntries; _a < _b.length; _a++) {
                var kadai = _b[_a];
                var kadaiCheckbox = dom_1.KadaiEntryDom.checkbox.cloneNode(true);
                var kadaiLabel = dom_1.KadaiEntryDom.label.cloneNode(true);
                var kadaiDueDate = dom_1.KadaiEntryDom.dueDate.cloneNode(true);
                var kadaiRemainTime = dom_1.KadaiEntryDom.remainTime.cloneNode(true);
                var kadaiTitle = dom_1.KadaiEntryDom.title.cloneNode(true);
                var memoBadge = document.createElement("span");
                memoBadge.classList.add("add-badge", "add-badge-success");
                memoBadge.innerText = "メモ";
                var deleteBadge = document.createElement("span");
                deleteBadge.className = "del-button";
                deleteBadge.id = kadai.kadaiID;
                deleteBadge.addEventListener("click", eventListener_1.deleteKadaiMemo, true);
                deleteBadge.innerText = "×";
                var _date = new Date(kadai.dueDateTimestamp * 1000);
                var dispDue = _date.toLocaleDateString() + " " + _date.getHours() + ":" + ("00" + _date.getMinutes()).slice(-2);
                var timeRemain = utils_1.getTimeRemain((kadai.dueDateTimestamp * 1000 - utils_1.nowTime) / 1000);
                var daysUntilDue = utils_1.getDaysUntil(utils_1.nowTime, kadai.dueDateTimestamp * 1000);
                if ((daysUntilDue > 0 && daysUntilDue <= 1 && i === 0) || (daysUntilDue > 1 && daysUntilDue <= 5 && i === 1) || (daysUntilDue > 5 && daysUntilDue <= 14 && i === 2) || (daysUntilDue > 14 && i === 3)) {
                    kadaiDueDate.textContent = "" + dispDue;
                    kadaiRemainTime.textContent = "\u3042\u3068" + timeRemain[0] + "\u65E5" + timeRemain[1] + "\u6642\u9593" + timeRemain[2] + "\u5206";
                    kadaiTitle.textContent = "" + kadai.assignmentTitle;
                    if (kadai.isFinished)
                        kadaiCheckbox.checked = true;
                    kadaiCheckbox.id = kadai.kadaiID;
                    kadaiCheckbox.lectureID = item.lectureID;
                    kadaiCheckbox.addEventListener("change", eventListener_1.toggleKadaiFinishedFlag, false);
                    kadaiLabel.htmlFor = kadai.kadaiID;
                    if (kadai.isMemo) {
                        kadaiTitle.textContent = "";
                        kadaiTitle.appendChild(memoBadge);
                        kadaiTitle.append(kadai.assignmentTitle);
                        kadaiTitle.appendChild(deleteBadge);
                    }
                    dom_1.appendChildAll(dueGroupBody, [kadaiCheckbox, kadaiLabel, kadaiDueDate, kadaiRemainTime, kadaiTitle]);
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
        dom_1.appendChildAll(dom_1.miniPandA, [dom_1.kadaiDiv, dom_1.examDiv]);
        dom_1.appendChildAll(dom_1.kadaiDiv, [dueGroupHeader, dueGroupContainer]);
    }
    // 何もない時はRelaxPandAを表示する
    if (kadaiList.length === 0) {
        var kadaiTab = dom_1.kadaiDiv;
        var relaxDiv = dom_1.createElem("div", { className: "relaxpanda" });
        var relaxPandaP = dom_1.createElem("p", { className: "relaxpanda-p", innerText: "現在表示できる課題はありません" });
        var relaxPandaImg = dom_1.createElem("img", {
            className: "relaxpanda-img",
            alt: "logo",
            src: chrome.extension.getURL("img/relaxPanda.png"),
        });
        dom_1.appendChildAll(relaxDiv, [relaxPandaP, relaxPandaImg]);
        kadaiTab.appendChild(relaxDiv);
    }
}
exports.updateMiniPandA = updateMiniPandA;
function createNavBarNotification(lectureIDList, kadaiList) {
    var defaultTab = document.querySelectorAll(".Mrphs-sitesNav__menuitem");
    var defaultTabCount = Object.keys(defaultTab).length;
    for (var _i = 0, lectureIDList_2 = lectureIDList; _i < lectureIDList_2.length; _i++) {
        var lecture = lectureIDList_2[_i];
        var _loop_1 = function (j) {
            // @ts-ignore
            var lectureID = defaultTab[j].getElementsByClassName("link-container")[0].href.match("(https?://[^/]+)/portal/site-reset/([^/]+)")[2];
            var q = kadaiList.findIndex(function (kadai) {
                return kadai.lectureID === lectureID;
            });
            if (q !== -1) {
                if (!kadaiList[q].isRead) {
                    defaultTab[j].classList.add("red-badge");
                }
                var daysUntilDue = utils_1.getDaysUntil(utils_1.nowTime, kadaiList[q].closestDueDateTimestamp * 1000);
                var aTagCount = defaultTab[j].getElementsByTagName("a").length;
                if (daysUntilDue > 0 && daysUntilDue <= 1) {
                    defaultTab[j].classList.add("nav-danger");
                    for (var i = 0; i < aTagCount; i++) {
                        defaultTab[j].getElementsByTagName("a")[i].classList.add("nav-danger");
                    }
                }
                else if (daysUntilDue > 1 && daysUntilDue <= 5) {
                    defaultTab[j].classList.add("nav-warning");
                    for (var i = 0; i < aTagCount; i++) {
                        defaultTab[j].getElementsByTagName("a")[i].classList.add("nav-warning");
                    }
                }
                else if (daysUntilDue > 5 && daysUntilDue <= 14) {
                    defaultTab[j].classList.add("nav-safe");
                    for (var i = 0; i < aTagCount; i++) {
                        defaultTab[j].getElementsByTagName("a")[i].classList.add("nav-safe");
                    }
                }
            }
        };
        for (var j = 3; j < defaultTabCount; j++) {
            _loop_1(j);
        }
    }
}
exports.createNavBarNotification = createNavBarNotification;


/***/ }),

/***/ "./src/network.ts":
/*!************************!*\
  !*** ./src/network.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getKadaiOfLectureID = exports.fetchLectureIDs = void 0;
var kadai_1 = __webpack_require__(/*! ./kadai */ "./src/kadai.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
// Lecture ID をすべて取得する
// ネットワーク通信は行わない
// returns [domain, {tabType, lectureID, lectureName}]
function fetchLectureIDs() {
    var elementCollection = document.getElementsByClassName("fav-sites-entry");
    var elements = Array.prototype.slice.call(elementCollection);
    var result = [];
    var domain = null;
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var elem = elements_1[_i];
        var lectureInfo = { tabType: "default", lectureID: "", lectureName: "" }; // tabTypeはPandAのトップバーに存在するかしないか
        var lecture = elem
            .getElementsByTagName("div")[0]
            .getElementsByTagName("a")[0];
        var m = lecture.href.match("(https?://[^/]+)/portal/site-reset/([^/]+)");
        if (m && m[2][0] !== "~") {
            lectureInfo.lectureID = m[2];
            lectureInfo.lectureName = lecture.title;
            result.push(lectureInfo);
            if (!domain) {
                domain = m[1];
            }
        }
    }
    return [domain, result];
}
exports.fetchLectureIDs = fetchLectureIDs;
function getKadaiOfLectureID(baseURL, lectureID) {
    var queryURL = baseURL + "/direct/assignment/site/" + lectureID + ".json";
    var request = new XMLHttpRequest();
    request.open("GET", queryURL);
    // キャッシュ対策
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Cache-Control", "no-cache");
    request.setRequestHeader("If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT");
    request.responseType = "json";
    return new Promise(function (resolve, reject) {
        request.addEventListener("load", function (e) {
            var res = request.response;
            if (!res || !res.assignment_collection)
                reject("404 kadai data not found");
            else {
                var kadaiEntries = convJsonToKadaiEntries(res, baseURL, lectureID);
                resolve(new kadai_1.Kadai(lectureID, lectureID, // TODO: lectureName
                kadaiEntries, false));
            }
        });
        request.send();
    });
}
exports.getKadaiOfLectureID = getKadaiOfLectureID;
function convJsonToKadaiEntries(data, baseURL, siteID) {
    return data.assignment_collection
        .filter(function (json) { return json.dueTime.epochSecond * 1000 >= utils_1.nowTime; })
        .map(function (json) {
        var kadaiID = json.id;
        var kadaiTitle = json.title;
        var kadaiDetail = json.instructions;
        var kadaiDueEpoch = json.dueTime.epochSecond;
        var entry = new kadai_1.KadaiEntry(kadaiID, kadaiTitle, kadaiDueEpoch, false, false, kadaiDetail);
        entry.kadaiPage = baseURL + "/portal/site/" + siteID;
        return entry;
    });
}


/***/ }),

/***/ "./src/storage.ts":
/*!************************!*\
  !*** ./src/storage.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.saveToStorage = exports.loadFromStorage = void 0;
function loadFromStorage(key) {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get(key, function (items) {
            if (typeof items[key] === "undefined")
                resolve([]);
            else
                resolve(items[key]);
        });
    });
}
exports.loadFromStorage = loadFromStorage;
function saveToStorage(key, value) {
    var entity = {};
    entity[key] = value;
    return new Promise(function (resolve, reject) {
        chrome.storage.local.set(entity, function () {
            resolve("saved");
        });
    });
}
exports.saveToStorage = saveToStorage;


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mergeMemoIntoKadaiList = exports.genUniqueStr = exports.useCache = exports.updateIsReadFlag = exports.compareAndMergeKadaiList = exports.convertArrayToKadai = exports.miniPandAReady = exports.isLoggedIn = exports.createLectureIDMap = exports.getTimeRemain = exports.getDaysUntil = exports.nowTime = void 0;
var kadai_1 = __webpack_require__(/*! ./kadai */ "./src/kadai.ts");
var storage_1 = __webpack_require__(/*! ./storage */ "./src/storage.ts");
exports.nowTime = new Date().getTime();
var cacheInterval = 120;
function getDaysUntil(dt1, dt2) {
    // 締め切りまでの日数を計算します
    var diff = (dt2 - dt1) / 1000;
    diff /= 3600 * 24;
    return diff;
}
exports.getDaysUntil = getDaysUntil;
function getTimeRemain(_remainTime) {
    var day = Math.floor(_remainTime / (3600 * 24));
    var hours = Math.floor((_remainTime - day * 3600 * 24) / 3600);
    var minutes = Math.floor((_remainTime - (day * 3600 * 24 + hours * 3600)) / 60);
    return [day, hours, minutes];
}
exports.getTimeRemain = getTimeRemain;
function createLectureIDMap(lectureIDList) {
    // 講義IDと講義名のMapを作る
    var lectureIDMap = new Map();
    for (var _i = 0, lectureIDList_1 = lectureIDList; _i < lectureIDList_1.length; _i++) {
        var lec = lectureIDList_1[_i];
        lectureIDMap.set(lec.lectureID, lec.lectureName);
    }
    return lectureIDMap;
}
exports.createLectureIDMap = createLectureIDMap;
function isLoggedIn() {
    // ログインしているかどうかを返す
    var scripts = document.getElementsByTagName("script");
    var loggedIn = false;
    // @ts-ignore
    for (var _i = 0, scripts_1 = scripts; _i < scripts_1.length; _i++) {
        var script = scripts_1[_i];
        if (script.text.match('"loggedIn": true'))
            loggedIn = true;
    }
    return loggedIn;
}
exports.isLoggedIn = isLoggedIn;
function getCurrentLectureID() {
    // 現在のページの講義IDを返す
    var url = location.href;
    var lectureID = "";
    var reg = new RegExp("(https?://[^/]+)/portal/site/([^/]+)");
    if (url.match(reg)) {
        // @ts-ignore
        lectureID = url.match(reg)[2];
    }
    return lectureID;
}
function updateIsReadFlag(kadaiList) {
    var lectureID = getCurrentLectureID();
    var updatedKadaiList = [];
    if (lectureID && lectureID.length >= 17) {
        for (var _i = 0, kadaiList_1 = kadaiList; _i < kadaiList_1.length; _i++) {
            var kadai = kadaiList_1[_i];
            if (kadai.lectureID === lectureID) {
                updatedKadaiList.push(new kadai_1.Kadai(kadai.lectureID, kadai.lectureName, kadai.kadaiEntries, true));
            }
            else {
                updatedKadaiList.push(kadai);
            }
        }
        storage_1.saveToStorage("TSkadaiList", updatedKadaiList);
    }
}
exports.updateIsReadFlag = updateIsReadFlag;
function miniPandAReady() {
    // ロード表示を切り替えて3本線表示にする
    var hamburger = document.getElementsByClassName("loader")[0];
    hamburger.className = "";
    hamburger.id = "hamburger";
    hamburger.textContent = "☰";
}
exports.miniPandAReady = miniPandAReady;
function convertArrayToKadai(arr) {
    var kadaiList = [];
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var i = arr_1[_i];
        var kadaiEntries = [];
        for (var _a = 0, _b = i.kadaiEntries; _a < _b.length; _a++) {
            var e = _b[_a];
            var entry = new kadai_1.KadaiEntry(e.kadaiID, e.assignmentTitle, e.dueDateTimestamp, e.isMemo, e.isFinished, e.assignmentDetail);
            entry.kadaiPage = e.kadaiPage;
            kadaiEntries.push(entry);
        }
        kadaiList.push(new kadai_1.Kadai(i.lectureID, i.lectureName, kadaiEntries, i.isRead));
    }
    return kadaiList;
}
exports.convertArrayToKadai = convertArrayToKadai;
function compareAndMergeKadaiList(oldKadaiList, newKadaiList) {
    var mergedKadaiList = [];
    var _loop_1 = function (newKadai) {
        var idx = oldKadaiList.findIndex(function (oldKadai) {
            return (oldKadai.lectureID === newKadai.lectureID);
        });
        // もし過去に保存した課題リストの中に講義IDが存在しない時
        if (idx === -1) {
            // 未読フラグを立ててマージ
            var isRead = newKadai.kadaiEntries.length === 0;
            newKadai.kadaiEntries.sort(function (a, b) { return a.dueDateTimestamp - b.dueDateTimestamp; });
            mergedKadaiList.push(new kadai_1.Kadai(newKadai.lectureID, newKadai.lectureName, newKadai.kadaiEntries, isRead));
        }
        // 過去に保存した課題リストの中に講義IDが存在する時
        else {
            // 未読フラグを引き継ぐ
            var isRead = oldKadaiList[idx].isRead;
            var mergedKadaiEntries = [];
            var _loop_2 = function (newKadaiEntry) {
                // 新しく取得した課題が保存された課題一覧の中にあるか探す
                var q = oldKadaiList[idx].kadaiEntries.findIndex(function (oldKadaiEntry) {
                    return (oldKadaiEntry.kadaiID === newKadaiEntry.kadaiID);
                });
                // もしなければ新規課題なので未読フラグを立てる
                if (q === -1) {
                    isRead = false;
                    mergedKadaiEntries.push(newKadaiEntry);
                }
                else {
                    var entry = new kadai_1.KadaiEntry(newKadaiEntry.kadaiID, newKadaiEntry.assignmentTitle, newKadaiEntry.dueDateTimestamp, newKadaiEntry.isMemo, oldKadaiList[idx].kadaiEntries[q].isFinished, newKadaiEntry.assignmentDetail);
                    entry.kadaiPage = newKadaiEntry.kadaiPage;
                    mergedKadaiEntries.push(entry);
                }
            };
            for (var _i = 0, _a = newKadai.kadaiEntries; _i < _a.length; _i++) {
                var newKadaiEntry = _a[_i];
                _loop_2(newKadaiEntry);
            }
            // 未読フラグ部分を変更してマージ
            mergedKadaiEntries.sort(function (a, b) { return a.dueDateTimestamp - b.dueDateTimestamp; });
            mergedKadaiList.push(new kadai_1.Kadai(newKadai.lectureID, newKadai.lectureName, mergedKadaiEntries, isRead));
        }
    };
    // 最新の課題リストをもとにマージする
    for (var _i = 0, newKadaiList_1 = newKadaiList; _i < newKadaiList_1.length; _i++) {
        var newKadai = newKadaiList_1[_i];
        _loop_1(newKadai);
    }
    return mergedKadaiList;
}
exports.compareAndMergeKadaiList = compareAndMergeKadaiList;
function mergeMemoIntoKadaiList(kadaiList, kadaiMemoList) {
    var mergedKadaiList = [];
    for (var _i = 0, kadaiList_2 = kadaiList; _i < kadaiList_2.length; _i++) {
        var kadai = kadaiList_2[_i];
        mergedKadaiList.push(new kadai_1.Kadai(kadai.lectureID, kadai.lectureName, kadai.kadaiEntries, kadai.isRead));
    }
    var _loop_3 = function (kadaiMemo) {
        var idx = kadaiList.findIndex(function (kadai) {
            return (kadaiMemo.lectureID === kadai.lectureID);
        });
        if (idx !== -1) {
            mergedKadaiList[idx].kadaiEntries = mergedKadaiList[idx].kadaiEntries.concat(kadaiMemo.kadaiEntries);
        }
        else {
            mergedKadaiList.push(new kadai_1.Kadai(kadaiMemo.lectureID, kadaiMemo.lectureName, kadaiMemo.kadaiEntries, true));
        }
    };
    for (var _a = 0, kadaiMemoList_1 = kadaiMemoList; _a < kadaiMemoList_1.length; _a++) {
        var kadaiMemo = kadaiMemoList_1[_a];
        _loop_3(kadaiMemo);
    }
    return mergedKadaiList;
}
exports.mergeMemoIntoKadaiList = mergeMemoIntoKadaiList;
function useCache(fetchedTime) {
    return (exports.nowTime - fetchedTime) / 1000 > cacheInterval;
}
exports.useCache = useCache;
function genUniqueStr() {
    return "m" + new Date().getTime().toString(16) + Math.floor(123456 * Math.random()).toString(16);
}
exports.genUniqueStr = genUniqueStr;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/content_script.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb21mb3J0YWJsZS1wYW5kYS10cy8uL3NyYy9ib29rbWFyay50cyIsIndlYnBhY2s6Ly9jb21mb3J0YWJsZS1wYW5kYS10cy8uL3NyYy9jb250ZW50X3NjcmlwdC50cyIsIndlYnBhY2s6Ly9jb21mb3J0YWJsZS1wYW5kYS10cy8uL3NyYy9kb20udHMiLCJ3ZWJwYWNrOi8vY29tZm9ydGFibGUtcGFuZGEtdHMvLi9zcmMvZXZlbnRMaXN0ZW5lci50cyIsIndlYnBhY2s6Ly9jb21mb3J0YWJsZS1wYW5kYS10cy8uL3NyYy9rYWRhaS50cyIsIndlYnBhY2s6Ly9jb21mb3J0YWJsZS1wYW5kYS10cy8uL3NyYy9taW5pcGFuZGEudHMiLCJ3ZWJwYWNrOi8vY29tZm9ydGFibGUtcGFuZGEtdHMvLi9zcmMvbmV0d29yay50cyIsIndlYnBhY2s6Ly9jb21mb3J0YWJsZS1wYW5kYS10cy8uL3NyYy9zdG9yYWdlLnRzIiwid2VicGFjazovL2NvbWZvcnRhYmxlLXBhbmRhLXRzLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL2NvbWZvcnRhYmxlLXBhbmRhLXRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NvbWZvcnRhYmxlLXBhbmRhLXRzL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0Qsb0NBQW9DO0FBQ3BDLHNCQUFzQixtQkFBTyxDQUFDLCtDQUFpQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLDJCQUEyQjtBQUNwRCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsa0JBQWtCLEVBQUU7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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ZmlsZSI6ImNvbnRlbnRfc2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZE1pc3NpbmdCb29rbWFya2VkTGVjdHVyZXMgPSB2b2lkIDA7XG52YXIgZXZlbnRMaXN0ZW5lcl8xID0gcmVxdWlyZShcIi4vZXZlbnRMaXN0ZW5lclwiKTtcbnZhciBNQVhfRkFWT1JJVEVTID0gMTA7XG5mdW5jdGlvbiBnZXRTaXRlSWRBbmRIcmVmTGVjdHVyZU5hbWVNYXAoKSB7XG4gICAgdmFyIHNpdGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5mYXYtc2l0ZXMtZW50cnlcIik7XG4gICAgdmFyIG1hcCA9IG5ldyBNYXAoKTtcbiAgICBzaXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChzaXRlKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICB2YXIgc2l0ZUlkID0gKF9hID0gc2l0ZS5xdWVyeVNlbGVjdG9yKFwiLnNpdGUtZmF2b3JpdGUtYnRuXCIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0QXR0cmlidXRlKFwiZGF0YS1zaXRlLWlkXCIpO1xuICAgICAgICBpZiAoc2l0ZUlkID09IG51bGwpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBocmVmID0gKChfYiA9IHNpdGUucXVlcnlTZWxlY3RvcihcIi5mYXYtdGl0bGVcIikpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jaGlsZE5vZGVzWzFdKS5ocmVmO1xuICAgICAgICB2YXIgdGl0bGUgPSAoKF9jID0gc2l0ZS5xdWVyeVNlbGVjdG9yKFwiLmZhdi10aXRsZVwiKSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmNoaWxkTm9kZXNbMV0pLnRpdGxlO1xuICAgICAgICBtYXAuc2V0KHNpdGVJZCwgeyBocmVmOiBocmVmLCB0aXRsZTogdGl0bGUgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG1hcDtcbn1cbmZ1bmN0aW9uIGlzQ3VycmVudFNpdGUoc2l0ZUlkKSB7XG4gICAgdmFyIGN1cnJlbnRTaXRlSWRNID0gd2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL2h0dHBzPzpcXC9cXC9wYW5kYVxcLmVjc1xcLmt5b3RvLXVcXC5hY1xcLmpwXFwvcG9ydGFsXFwvc2l0ZVxcLyhbXlxcL10rKS8pO1xuICAgIGlmIChjdXJyZW50U2l0ZUlkTSA9PSBudWxsKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIGN1cnJlbnRTaXRlSWRNWzFdID09IHNpdGVJZDtcbn1cbi8vIOOBiuawl+OBq+WFpeOCiuS4iumZkOOCkui2heOBiOOBn+ism+e+qeOCkiB0b3BiYXIg44Gr6L+95Yqg44GZ44KLXG4vLyDjg43jg4Pjg4jjg6/jg7zjgq/pgJrkv6HjgpLooYzjgYbjga7jgafms6jmhI9cbmZ1bmN0aW9uIGFkZE1pc3NpbmdCb29rbWFya2VkTGVjdHVyZXMoKSB7XG4gICAgdmFyIHRvcG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdG9wbmF2XCIpO1xuICAgIGlmICh0b3BuYXYgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgcmV0dXJuIHJlc29sdmUoKTsgfSk7XG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgXCJodHRwczovL3BhbmRhLmVjcy5reW90by11LmFjLmpwL3BvcnRhbC9mYXZvcml0ZXMvbGlzdFwiKTtcbiAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IFwianNvblwiO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm9yZ2FuaXplRmF2b3JpdGVzXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudExpc3RlbmVyXzEuZWRpdEZhdlRhYk1lc3NhZ2UpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciByZXMgPSByZXF1ZXN0LnJlc3BvbnNlO1xuICAgICAgICAgICAgaWYgKHJlcyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmYWlsZWQgdG8gZmV0Y2ggZmF2b3JpdGVzIGxpc3RcIik7XG4gICAgICAgICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZmF2b3JpdGVzID0gcmVzLmZhdm9yaXRlU2l0ZUlkcztcbiAgICAgICAgICAgIHZhciBzaXRlc0luZm8gPSBnZXRTaXRlSWRBbmRIcmVmTGVjdHVyZU5hbWVNYXAoKTtcbiAgICAgICAgICAgIGlmIChmYXZvcml0ZXMubGVuZ3RoID4gTUFYX0ZBVk9SSVRFUykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBmYXZvcml0ZXMuc2xpY2UoTUFYX0ZBVk9SSVRFUyk7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtaXNzaW5nRmF2b3JpdGVJZCA9IF9hW19pXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ3VycmVudFNpdGUobWlzc2luZ0Zhdm9yaXRlSWQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzaXRlSW5mbyA9IHNpdGVzSW5mby5nZXQobWlzc2luZ0Zhdm9yaXRlSWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2l0ZUluZm8gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBocmVmID0gc2l0ZUluZm8uaHJlZjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gc2l0ZUluZm8udGl0bGU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgICAgICAgICAgbGkuY2xhc3NMaXN0LmFkZChcIk1ycGhzLXNpdGVzTmF2X19tZW51aXRlbVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuY2hvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgICAgICAgICBhbmNob3IuY2xhc3NMaXN0LmFkZChcImxpbmstY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgICAgICBhbmNob3IuaHJlZiA9IGhyZWY7XG4gICAgICAgICAgICAgICAgICAgIGFuY2hvci50aXRsZSA9IHRpdGxlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICAgICAgICBzcGFuLmlubmVyVGV4dCA9IHRpdGxlO1xuICAgICAgICAgICAgICAgICAgICBhbmNob3IuYXBwZW5kQ2hpbGQoc3Bhbik7XG4gICAgICAgICAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGFuY2hvcik7XG4gICAgICAgICAgICAgICAgICAgIHRvcG5hdi5hcHBlbmRDaGlsZChsaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgfSk7XG59XG5leHBvcnRzLmFkZE1pc3NpbmdCb29rbWFya2VkTGVjdHVyZXMgPSBhZGRNaXNzaW5nQm9va21hcmtlZExlY3R1cmVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kaXNwbGF5TWluaVBhbmRBID0gZXhwb3J0cy5tZXJnZWRLYWRhaUxpc3ROb01lbW8gPSBleHBvcnRzLm1lcmdlZEthZGFpTGlzdCA9IGV4cG9ydHMubGVjdHVyZUlETGlzdCA9IGV4cG9ydHMuZmV0Y2hlZFRpbWUgPSB2b2lkIDA7XG52YXIgc3RvcmFnZV8xID0gcmVxdWlyZShcIi4vc3RvcmFnZVwiKTtcbnZhciBuZXR3b3JrXzEgPSByZXF1aXJlKFwiLi9uZXR3b3JrXCIpO1xudmFyIG1pbmlwYW5kYV8xID0gcmVxdWlyZShcIi4vbWluaXBhbmRhXCIpO1xudmFyIGJvb2ttYXJrXzEgPSByZXF1aXJlKFwiLi9ib29rbWFya1wiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgYmFzZVVSTCA9IFwiaHR0cHM6Ly9wYW5kYS5lY3Mua3lvdG8tdS5hYy5qcFwiO1xuZnVuY3Rpb24gbG9hZEFuZE1lcmdlS2FkYWlMaXN0KGxlY3R1cmVJRExpc3QsIHVzZUNhY2hlKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgb2xkS2FkYWlMaXN0LCBuZXdLYWRhaUxpc3QsIHBlbmRpbmdMaXN0LCBfaSwgbGVjdHVyZUlETGlzdF8xLCBpLCByZXN1bHQsIF9hLCByZXN1bHRfMSwgaywga2FkYWlNZW1vTGlzdCwgX2I7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHN0b3JhZ2VfMS5sb2FkRnJvbVN0b3JhZ2UoXCJUU2thZGFpTGlzdFwiKV07XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBvbGRLYWRhaUxpc3QgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0thZGFpTGlzdCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXVzZUNhY2hlKSByZXR1cm4gWzMgLypicmVhayovLCA0XTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLjgq3jg6Pjg4Pjgrfjg6XjgarjgZdcIik7XG4gICAgICAgICAgICAgICAgICAgIHBlbmRpbmdMaXN0ID0gW107XG4gICAgICAgICAgICAgICAgICAgIC8vIOiqsumhjOWPluW+l+W+heOBoeODquOCueODiOOBq+i/veWKoFxuICAgICAgICAgICAgICAgICAgICBmb3IgKF9pID0gMCwgbGVjdHVyZUlETGlzdF8xID0gbGVjdHVyZUlETGlzdDsgX2kgPCBsZWN0dXJlSURMaXN0XzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gbGVjdHVyZUlETGlzdF8xW19pXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlbmRpbmdMaXN0LnB1c2gobmV0d29ya18xLmdldEthZGFpT2ZMZWN0dXJlSUQoYmFzZVVSTCwgaS5sZWN0dXJlSUQpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBQcm9taXNlLmFsbFNldHRsZWQocGVuZGluZ0xpc3QpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChfYSA9IDAsIHJlc3VsdF8xID0gcmVzdWx0OyBfYSA8IHJlc3VsdF8xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgayA9IHJlc3VsdF8xW19hXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdLYWRhaUxpc3QucHVzaChrLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyDlj5blvpfjgZfjgZ/mmYLplpPjgpLkv53lrZhcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgc3RvcmFnZV8xLnNhdmVUb1N0b3JhZ2UoXCJUU2ZldGNoZWRUaW1lXCIsIHV0aWxzXzEubm93VGltZSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgLy8g5Y+W5b6X44GX44Gf5pmC6ZaT44KS5L+d5a2YXG4gICAgICAgICAgICAgICAgICAgIF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8g5L+d5a2Y44GX44Gm44GC44Gj44Gf44KC44Gu44Go44Oe44O844K444GZ44KLXG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHMubWVyZ2VkS2FkYWlMaXN0Tm9NZW1vID0gdXRpbHNfMS5jb21wYXJlQW5kTWVyZ2VLYWRhaUxpc3Qob2xkS2FkYWlMaXN0LCBuZXdLYWRhaUxpc3QpO1xuICAgICAgICAgICAgICAgICAgICBleHBvcnRzLm1lcmdlZEthZGFpTGlzdCA9IHV0aWxzXzEuY29tcGFyZUFuZE1lcmdlS2FkYWlMaXN0KG9sZEthZGFpTGlzdCwgbmV3S2FkYWlMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNV07XG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuOCreODo+ODg+OCt+ODpeOBguOCilwiKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0cy5tZXJnZWRLYWRhaUxpc3ROb01lbW8gPSB1dGlsc18xLmNvbXBhcmVBbmRNZXJnZUthZGFpTGlzdChvbGRLYWRhaUxpc3QsIG9sZEthZGFpTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHMubWVyZ2VkS2FkYWlMaXN0ID0gdXRpbHNfMS5jb21wYXJlQW5kTWVyZ2VLYWRhaUxpc3Qob2xkS2FkYWlMaXN0LCBvbGRLYWRhaUxpc3QpO1xuICAgICAgICAgICAgICAgICAgICBfYy5sYWJlbCA9IDU7XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBcbiAgICAgICAgICAgICAgICAvLyDjg57jg7zjgrjlvozjga5rYWRhaUxpc3TjgpLjgrnjg4jjg6zjg7zjgrjjgavkv53lrZjjgZnjgotcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBzdG9yYWdlXzEuc2F2ZVRvU3RvcmFnZShcIlRTa2FkYWlMaXN0XCIsIGV4cG9ydHMubWVyZ2VkS2FkYWlMaXN0Tm9NZW1vKV07XG4gICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICAvLyDjg57jg7zjgrjlvozjga5rYWRhaUxpc3TjgpLjgrnjg4jjg6zjg7zjgrjjgavkv53lrZjjgZnjgotcbiAgICAgICAgICAgICAgICAgICAgX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBfYiA9IHV0aWxzXzEuY29udmVydEFycmF5VG9LYWRhaTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgc3RvcmFnZV8xLmxvYWRGcm9tU3RvcmFnZShcIlRTa2FkYWlNZW1vTGlzdFwiKV07XG4gICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgICAgICBrYWRhaU1lbW9MaXN0ID0gX2IuYXBwbHkodm9pZCAwLCBbX2Muc2VudCgpXSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIOOBleOCieOBq+ODoeODouOCguODnuODvOOCuOOBmeOCi1xuICAgICAgICAgICAgICAgICAgICBleHBvcnRzLm1lcmdlZEthZGFpTGlzdCA9IHV0aWxzXzEubWVyZ2VNZW1vSW50b0thZGFpTGlzdChleHBvcnRzLm1lcmdlZEthZGFpTGlzdCwga2FkYWlNZW1vTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBleHBvcnRzLm1lcmdlZEthZGFpTGlzdF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZGlzcGxheU1pbmlQYW5kQShtZXJnZWRLYWRhaUxpc3QsIGxlY3R1cmVJRExpc3QsIGZldGNoZWRUaW1lKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBtaW5pcGFuZGFfMS5jcmVhdGVNaW5pUGFuZEEodXRpbHNfMS51c2VDYWNoZShmZXRjaGVkVGltZSkgPyB1dGlsc18xLm5vd1RpbWUgOiBmZXRjaGVkVGltZSk7XG4gICAgICAgICAgICBtaW5pcGFuZGFfMS5hcHBlbmRNZW1vQm94KGxlY3R1cmVJRExpc3QpO1xuICAgICAgICAgICAgbWluaXBhbmRhXzEudXBkYXRlTWluaVBhbmRBKG1lcmdlZEthZGFpTGlzdCwgbGVjdHVyZUlETGlzdCk7XG4gICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0cy5kaXNwbGF5TWluaVBhbmRBID0gZGlzcGxheU1pbmlQYW5kQTtcbmZ1bmN0aW9uIG1haW4oKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIXV0aWxzXzEuaXNMb2dnZWRJbigpKSByZXR1cm4gWzMgLypicmVhayovLCA1XTtcbiAgICAgICAgICAgICAgICAgICAgbWluaXBhbmRhXzEuY3JlYXRlSGFuYnVyZ2VyQnV0dG9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHN0b3JhZ2VfMS5sb2FkRnJvbVN0b3JhZ2UoXCJUU2ZldGNoZWRUaW1lXCIpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHMuZmV0Y2hlZFRpbWUgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHMubGVjdHVyZUlETGlzdCA9IG5ldHdvcmtfMS5mZXRjaExlY3R1cmVJRHMoKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbG9hZEFuZE1lcmdlS2FkYWlMaXN0KGV4cG9ydHMubGVjdHVyZUlETGlzdCwgdXRpbHNfMS51c2VDYWNoZShleHBvcnRzLmZldGNoZWRUaW1lKSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0cy5tZXJnZWRLYWRhaUxpc3QgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGRpc3BsYXlNaW5pUGFuZEEoZXhwb3J0cy5tZXJnZWRLYWRhaUxpc3QsIGV4cG9ydHMubGVjdHVyZUlETGlzdCwgZXhwb3J0cy5mZXRjaGVkVGltZSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICB1dGlsc18xLm1pbmlQYW5kQVJlYWR5KCk7XG4gICAgICAgICAgICAgICAgICAgIHV0aWxzXzEudXBkYXRlSXNSZWFkRmxhZyhleHBvcnRzLm1lcmdlZEthZGFpTGlzdE5vTWVtbyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGJvb2ttYXJrXzEuYWRkTWlzc2luZ0Jvb2ttYXJrZWRMZWN0dXJlcygpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgbWluaXBhbmRhXzEuY3JlYXRlTmF2QmFyTm90aWZpY2F0aW9uKGV4cG9ydHMubGVjdHVyZUlETGlzdCwgZXhwb3J0cy5tZXJnZWRLYWRhaUxpc3QpO1xuICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDU7XG4gICAgICAgICAgICAgICAgY2FzZSA1OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxubWFpbigpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFwcGVuZENoaWxkQWxsID0gZXhwb3J0cy5jcmVhdGVFbGVtID0gZXhwb3J0cy5EdWVHcm91cERvbSA9IGV4cG9ydHMuS2FkYWlFbnRyeURvbSA9IGV4cG9ydHMuaGFtYnVyZ2VyID0gZXhwb3J0cy5leGFtRGl2ID0gZXhwb3J0cy5rYWRhaURpdiA9IGV4cG9ydHMubWluaVBhbmRBID0gdm9pZCAwO1xudmFyIGV2ZW50TGlzdGVuZXJfMSA9IHJlcXVpcmUoXCIuL2V2ZW50TGlzdGVuZXJcIik7XG5mdW5jdGlvbiBjcmVhdGVFbGVtKHRhZywgZGljdCkge1xuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgIGZvciAodmFyIGtleSBpbiBkaWN0KSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZWxlbVtrZXldID0gZGljdFtrZXldO1xuICAgIH1cbiAgICByZXR1cm4gZWxlbTtcbn1cbmV4cG9ydHMuY3JlYXRlRWxlbSA9IGNyZWF0ZUVsZW07XG5mdW5jdGlvbiBhcHBlbmRDaGlsZEFsbCh0bywgYXJyKSB7XG4gICAgZm9yICh2YXIgb2JqIGluIGFycikge1xuICAgICAgICB0by5hcHBlbmRDaGlsZChhcnJbb2JqXSk7XG4gICAgfVxuICAgIHJldHVybiB0bztcbn1cbmV4cG9ydHMuYXBwZW5kQ2hpbGRBbGwgPSBhcHBlbmRDaGlsZEFsbDtcbmV4cG9ydHMubWluaVBhbmRBID0gY3JlYXRlRWxlbShcImRpdlwiLCB7IGlkOiBcIm1pbmlQYW5kQVwiIH0pO1xuZXhwb3J0cy5taW5pUGFuZEEuY2xhc3NMaXN0LmFkZChcInNpZGVuYXZcIik7XG5leHBvcnRzLm1pbmlQYW5kQS5jbGFzc0xpc3QuYWRkKFwiY3BfdGFiXCIpO1xuZXhwb3J0cy5rYWRhaURpdiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwia2FkYWktdGFiXCIgfSk7XG5leHBvcnRzLmV4YW1EaXYgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImV4YW0tdGFiXCIgfSk7XG5leHBvcnRzLmhhbWJ1cmdlciA9IGNyZWF0ZUVsZW0oXCJkaXZcIik7XG5leHBvcnRzLmhhbWJ1cmdlci5jbGFzc05hbWUgPSBcImxvYWRlclwiO1xuZXhwb3J0cy5oYW1idXJnZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50TGlzdGVuZXJfMS50b2dnbGVNaW5pUGFuZEEpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1uYW1lc3BhY2VcbnZhciBLYWRhaUVudHJ5RG9tO1xuKGZ1bmN0aW9uIChLYWRhaUVudHJ5RG9tKSB7XG4gICAgS2FkYWlFbnRyeURvbS5jaGVja2JveCA9IGNyZWF0ZUVsZW0oXCJpbnB1dFwiLCB7IHR5cGU6IFwiY2hlY2tib3hcIiwgY2xhc3NOYW1lOiBcInRvZG8tY2hlY2tcIiB9KTtcbiAgICBLYWRhaUVudHJ5RG9tLmxhYmVsID0gY3JlYXRlRWxlbShcImxhYmVsXCIpO1xuICAgIEthZGFpRW50cnlEb20udGl0bGUgPSBjcmVhdGVFbGVtKFwicFwiLCB7IGNsYXNzTmFtZTogXCJrYWRhaS10aXRsZVwiIH0pO1xuICAgIEthZGFpRW50cnlEb20uZHVlRGF0ZSA9IGNyZWF0ZUVsZW0oXCJwXCIsIHsgY2xhc3NOYW1lOiBcImthZGFpLWRhdGVcIiB9KTtcbiAgICBLYWRhaUVudHJ5RG9tLnJlbWFpblRpbWUgPSBjcmVhdGVFbGVtKFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJ0aW1lLXJlbWFpblwiIH0pO1xufSkoS2FkYWlFbnRyeURvbSB8fCAoS2FkYWlFbnRyeURvbSA9IHt9KSk7XG5leHBvcnRzLkthZGFpRW50cnlEb20gPSBLYWRhaUVudHJ5RG9tO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1uYW1lc3BhY2VcbnZhciBEdWVHcm91cERvbTtcbihmdW5jdGlvbiAoRHVlR3JvdXBEb20pIHtcbiAgICBEdWVHcm91cERvbS5oZWFkZXIgPSBjcmVhdGVFbGVtKFwiZGl2XCIpO1xuICAgIER1ZUdyb3VwRG9tLmhlYWRlclRpdGxlID0gY3JlYXRlRWxlbShcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwicVwiIH0pO1xuICAgIER1ZUdyb3VwRG9tLmNvbnRhaW5lciA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwic2lkZW5hdi1saXN0XCIgfSk7XG4gICAgRHVlR3JvdXBEb20uYm9keSA9IGNyZWF0ZUVsZW0oXCJkaXZcIik7XG4gICAgRHVlR3JvdXBEb20ubGVjdHVyZU5hbWUgPSBjcmVhdGVFbGVtKFwiYVwiKTtcbn0pKER1ZUdyb3VwRG9tIHx8IChEdWVHcm91cERvbSA9IHt9KSk7XG5leHBvcnRzLkR1ZUdyb3VwRG9tID0gRHVlR3JvdXBEb207XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmVkaXRGYXZUYWJNZXNzYWdlID0gZXhwb3J0cy5kZWxldGVLYWRhaU1lbW8gPSBleHBvcnRzLmFkZEthZGFpTWVtbyA9IGV4cG9ydHMudG9nZ2xlS2FkYWlGaW5pc2hlZEZsYWcgPSBleHBvcnRzLnRvZ2dsZU1lbW9Cb3ggPSBleHBvcnRzLnRvZ2dsZUV4YW1UYWIgPSBleHBvcnRzLnRvZ2dsZUthZGFpVGFiID0gZXhwb3J0cy50b2dnbGVNaW5pUGFuZEEgPSB2b2lkIDA7XG52YXIgZG9tXzEgPSByZXF1aXJlKFwiLi9kb21cIik7XG52YXIgc3RvcmFnZV8xID0gcmVxdWlyZShcIi4vc3RvcmFnZVwiKTtcbnZhciBrYWRhaV8xID0gcmVxdWlyZShcIi4va2FkYWlcIik7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIGNvbnRlbnRfc2NyaXB0XzEgPSByZXF1aXJlKFwiLi9jb250ZW50X3NjcmlwdFwiKTtcbnZhciB0b2dnbGUgPSBmYWxzZTtcbmZ1bmN0aW9uIHRvZ2dsZU1pbmlQYW5kQSgpIHtcbiAgICB2YXIgX2E7XG4gICAgLy8gbWluaVBhbmRB44KS6KGo56S644O76Z2e6KGo56S644Gr44GX44G+44GZXG4gICAgaWYgKHRvZ2dsZSkge1xuICAgICAgICBkb21fMS5taW5pUGFuZEEuc3R5bGUud2lkdGggPSBcIjBweFwiO1xuICAgICAgICAoX2EgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvdmVyXCIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVtb3ZlKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkb21fMS5taW5pUGFuZEEuc3R5bGUud2lkdGggPSBcIjMwMHB4XCI7XG4gICAgICAgIHZhciBjb3ZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvdmVyLmlkID0gXCJjb3ZlclwiO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF0uYXBwZW5kQ2hpbGQoY292ZXIpO1xuICAgICAgICBjb3Zlci5vbmNsaWNrID0gdG9nZ2xlTWluaVBhbmRBO1xuICAgIH1cbiAgICB0b2dnbGUgPSAhdG9nZ2xlO1xufVxuZXhwb3J0cy50b2dnbGVNaW5pUGFuZEEgPSB0b2dnbGVNaW5pUGFuZEE7XG5mdW5jdGlvbiB0b2dnbGVLYWRhaVRhYigpIHtcbiAgICAvLyDoqrLpoYzkuIDopqfjgr/jg5bjga7ooajnpLrjg7vpnZ7ooajnpLrjgpLjgZfjgb7jgZlcbiAgICB2YXIga2FkYWlUYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmthZGFpLXRhYlwiKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAga2FkYWlUYWIuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgdmFyIGV4YW1UYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmV4YW0tdGFiXCIpO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBleGFtVGFiLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB2YXIgYWRkTWVtb0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGx1cy1idXR0b25cIik7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGFkZE1lbW9CdXR0b24uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgdmFyIGxhc3RLYWRhaUdldFRpbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmthZGFpLXRpbWVcIik7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGxhc3RLYWRhaUdldFRpbWUuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG59XG5leHBvcnRzLnRvZ2dsZUthZGFpVGFiID0gdG9nZ2xlS2FkYWlUYWI7XG5mdW5jdGlvbiB0b2dnbGVFeGFtVGFiKCkge1xuICAgIC8vIOOCr+OCpOOCuuODu+Wwj+ODhuOCueODiOODu+ippumok+S4gOimp+OCv+ODluOCkuihqOekuuODu+mdnuihqOekuuOBq+OBl+OBvuOBmVxuICAgIHZhciBrYWRhaVRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIua2FkYWktdGFiXCIpO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBrYWRhaVRhYi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgdmFyIGV4YW1UYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmV4YW0tdGFiXCIpO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBleGFtVGFiLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgIHZhciBhZGRNZW1vQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbHVzLWJ1dHRvblwiKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgYWRkTWVtb0J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgdmFyIGxhc3RLYWRhaUdldFRpbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmthZGFpLXRpbWVcIik7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGxhc3RLYWRhaUdldFRpbWUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuZXhwb3J0cy50b2dnbGVFeGFtVGFiID0gdG9nZ2xlRXhhbVRhYjtcbmZ1bmN0aW9uIHRvZ2dsZU1lbW9Cb3goKSB7XG4gICAgLy8g44Oh44Oi6L+95Yqg44Gu44Oc44OD44Kv44K544KS6KGo56S644O76Z2e6KGo56S644Gr44GX44G+44GZXG4gICAgdmFyIGFkZE1lbW9Cb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFkZE1lbW9Cb3hcIik7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHZhciB0b2dnbGVTdGF0dXMgPSBhZGRNZW1vQm94LnN0eWxlLmRpc3BsYXk7XG4gICAgaWYgKHRvZ2dsZVN0YXR1cyA9PT0gXCJcIikge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGFkZE1lbW9Cb3guc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBhZGRNZW1vQm94LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgIH1cbn1cbmV4cG9ydHMudG9nZ2xlTWVtb0JveCA9IHRvZ2dsZU1lbW9Cb3g7XG5mdW5jdGlvbiB0b2dnbGVLYWRhaUZpbmlzaGVkRmxhZyhldmVudCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGthZGFpSUQsIGthZGFpTGlzdCwgX2EsIF9iLCB1cGRhdGVkS2FkYWlMaXN0LCBfaSwga2FkYWlMaXN0XzEsIGthZGFpLCB1cGRhdGVkS2FkYWlFbnRyaWVzLCBfYywgX2QsIGthZGFpRW50cnksIGlzRmluaXNoZWQ7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2UpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2UubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIGthZGFpSUQgPSBldmVudC50YXJnZXQuaWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGthZGFpSURbMF0gPT09IFwibVwiKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XG4gICAgICAgICAgICAgICAgICAgIF9hID0gdXRpbHNfMS5jb252ZXJ0QXJyYXlUb0thZGFpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBzdG9yYWdlXzEubG9hZEZyb21TdG9yYWdlKFwiVFNrYWRhaU1lbW9MaXN0XCIpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGthZGFpTGlzdCA9IF9hLmFwcGx5KHZvaWQgMCwgW19lLnNlbnQoKV0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA0XTtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIF9iID0gdXRpbHNfMS5jb252ZXJ0QXJyYXlUb0thZGFpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBzdG9yYWdlXzEubG9hZEZyb21TdG9yYWdlKFwiVFNrYWRhaUxpc3RcIildO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAga2FkYWlMaXN0ID0gX2IuYXBwbHkodm9pZCAwLCBbX2Uuc2VudCgpXSk7XG4gICAgICAgICAgICAgICAgICAgIF9lLmxhYmVsID0gNDtcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRLYWRhaUxpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChfaSA9IDAsIGthZGFpTGlzdF8xID0ga2FkYWlMaXN0OyBfaSA8IGthZGFpTGlzdF8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICAgICAga2FkYWkgPSBrYWRhaUxpc3RfMVtfaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkS2FkYWlFbnRyaWVzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKF9jID0gMCwgX2QgPSBrYWRhaS5rYWRhaUVudHJpZXM7IF9jIDwgX2QubGVuZ3RoOyBfYysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2FkYWlFbnRyeSA9IF9kW19jXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2FkYWlFbnRyeS5rYWRhaUlEID09PSBrYWRhaUlEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRmluaXNoZWQgPSBrYWRhaUVudHJ5LmlzRmluaXNoZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRLYWRhaUVudHJpZXMucHVzaChuZXcga2FkYWlfMS5LYWRhaUVudHJ5KGthZGFpRW50cnkua2FkYWlJRCwga2FkYWlFbnRyeS5hc3NpZ25tZW50VGl0bGUsIGthZGFpRW50cnkuZHVlRGF0ZVRpbWVzdGFtcCwga2FkYWlFbnRyeS5pc01lbW8sICFpc0ZpbmlzaGVkLCBrYWRhaUVudHJ5LmFzc2lnbm1lbnREZXRhaWwpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRLYWRhaUVudHJpZXMucHVzaChrYWRhaUVudHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkS2FkYWlMaXN0LnB1c2gobmV3IGthZGFpXzEuS2FkYWkoa2FkYWkubGVjdHVyZUlELCBrYWRhaS5sZWN0dXJlTmFtZSwgdXBkYXRlZEthZGFpRW50cmllcywga2FkYWkuaXNSZWFkKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGthZGFpSURbMF0gPT09IFwibVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmFnZV8xLnNhdmVUb1N0b3JhZ2UoXCJUU2thZGFpTWVtb0xpc3RcIiwgdXBkYXRlZEthZGFpTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JhZ2VfMS5zYXZlVG9TdG9yYWdlKFwiVFNrYWRhaUxpc3RcIiwgdXBkYXRlZEthZGFpTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnRzLnRvZ2dsZUthZGFpRmluaXNoZWRGbGFnID0gdG9nZ2xlS2FkYWlGaW5pc2hlZEZsYWc7XG5mdW5jdGlvbiBhZGRLYWRhaU1lbW8oKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2VsZWN0ZWRJZHgsIHRvZG9MZWNJRCwgdG9kb0NvbnRlbnQsIHRvZG9EdWUsIHRvZG9UaW1lc3RhbXAsIGthZGFpTWVtb0xpc3QsIGthZGFpTWVtb0VudHJ5LCBrYWRhaU1lbW8sIGlkeDtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJZHggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvZG9MZWNOYW1lXCIpLnNlbGVjdGVkSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHRvZG9MZWNJRCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG9kb0xlY05hbWVcIikub3B0aW9uc1tzZWxlY3RlZElkeF0uaWQ7XG4gICAgICAgICAgICAgICAgICAgIHRvZG9Db250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RvQ29udGVudFwiKS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdG9kb0R1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG9kb0R1ZVwiKS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdG9kb1RpbWVzdGFtcCA9IG5ldyBEYXRlKFwiXCIgKyB0b2RvRHVlKS5nZXRUaW1lKCkgLyAxMDAwO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBzdG9yYWdlXzEubG9hZEZyb21TdG9yYWdlKFwiVFNrYWRhaU1lbW9MaXN0XCIpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGthZGFpTWVtb0xpc3QgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGthZGFpTWVtb0VudHJ5ID0gbmV3IGthZGFpXzEuS2FkYWlFbnRyeSh1dGlsc18xLmdlblVuaXF1ZVN0cigpLCB0b2RvQ29udGVudCwgdG9kb1RpbWVzdGFtcCwgdHJ1ZSwgZmFsc2UsIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBrYWRhaU1lbW8gPSBuZXcga2FkYWlfMS5LYWRhaSh0b2RvTGVjSUQsIHRvZG9MZWNJRCwgW2thZGFpTWVtb0VudHJ5XSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Yga2FkYWlNZW1vTGlzdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBrYWRhaU1lbW9MaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGthZGFpTWVtb0xpc3QgPSB1dGlsc18xLmNvbnZlcnRBcnJheVRvS2FkYWkoa2FkYWlNZW1vTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHggPSBrYWRhaU1lbW9MaXN0LmZpbmRJbmRleChmdW5jdGlvbiAob2xkS2FkYWlNZW1vKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChvbGRLYWRhaU1lbW8ubGVjdHVyZUlEID09PSB0b2RvTGVjSUQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGthZGFpTWVtb0xpc3RbaWR4XS5rYWRhaUVudHJpZXMucHVzaChrYWRhaU1lbW9FbnRyeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrYWRhaU1lbW9MaXN0LnB1c2goa2FkYWlNZW1vKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGthZGFpTWVtb0xpc3QgPSBba2FkYWlNZW1vXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdG9yYWdlXzEuc2F2ZVRvU3RvcmFnZShcIlRTa2FkYWlNZW1vTGlzdFwiLCBrYWRhaU1lbW9MaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGRvbV8xLm1pbmlQYW5kQS5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb21fMS5taW5pUGFuZEEucmVtb3ZlQ2hpbGQoZG9tXzEubWluaVBhbmRBLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChkb21fMS5rYWRhaURpdi5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb21fMS5rYWRhaURpdi5yZW1vdmVDaGlsZChkb21fMS5rYWRhaURpdi5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkb21fMS5taW5pUGFuZEEucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGRvbV8xLmthZGFpRGl2LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBjb250ZW50X3NjcmlwdF8xLmRpc3BsYXlNaW5pUGFuZEEodXRpbHNfMS5tZXJnZU1lbW9JbnRvS2FkYWlMaXN0KGNvbnRlbnRfc2NyaXB0XzEubWVyZ2VkS2FkYWlMaXN0Tm9NZW1vLCBrYWRhaU1lbW9MaXN0KSwgY29udGVudF9zY3JpcHRfMS5sZWN0dXJlSURMaXN0LCBjb250ZW50X3NjcmlwdF8xLmZldGNoZWRUaW1lKV07XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnRzLmFkZEthZGFpTWVtbyA9IGFkZEthZGFpTWVtbztcbmZ1bmN0aW9uIGRlbGV0ZUthZGFpTWVtbyhldmVudCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGthZGFpSUQsIGthZGFpTWVtb0xpc3QsIF9hLCBkZWxldGVkS2FkYWlNZW1vTGlzdCwgX2ksIGthZGFpTWVtb0xpc3RfMSwga2FkYWlNZW1vLCBrYWRhaU1lbW9FbnRyaWVzLCBfYiwgX2MsIF9rYWRhaU1lbW9FbnRyeTtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfZCkge1xuICAgICAgICAgICAgc3dpdGNoIChfZC5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAga2FkYWlJRCA9IGV2ZW50LnRhcmdldC5pZDtcbiAgICAgICAgICAgICAgICAgICAgX2EgPSB1dGlsc18xLmNvbnZlcnRBcnJheVRvS2FkYWk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHN0b3JhZ2VfMS5sb2FkRnJvbVN0b3JhZ2UoXCJUU2thZGFpTWVtb0xpc3RcIildO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAga2FkYWlNZW1vTGlzdCA9IF9hLmFwcGx5KHZvaWQgMCwgW19kLnNlbnQoKV0pO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGVkS2FkYWlNZW1vTGlzdCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKF9pID0gMCwga2FkYWlNZW1vTGlzdF8xID0ga2FkYWlNZW1vTGlzdDsgX2kgPCBrYWRhaU1lbW9MaXN0XzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrYWRhaU1lbW8gPSBrYWRhaU1lbW9MaXN0XzFbX2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAga2FkYWlNZW1vRW50cmllcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChfYiA9IDAsIF9jID0ga2FkYWlNZW1vLmthZGFpRW50cmllczsgX2IgPCBfYy5sZW5ndGg7IF9iKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfa2FkYWlNZW1vRW50cnkgPSBfY1tfYl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9rYWRhaU1lbW9FbnRyeS5rYWRhaUlEICE9PSBrYWRhaUlEKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrYWRhaU1lbW9FbnRyaWVzLnB1c2goX2thZGFpTWVtb0VudHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWRLYWRhaU1lbW9MaXN0LnB1c2gobmV3IGthZGFpXzEuS2FkYWkoa2FkYWlNZW1vLmxlY3R1cmVJRCwga2FkYWlNZW1vLmxlY3R1cmVOYW1lLCBrYWRhaU1lbW9FbnRyaWVzLCBrYWRhaU1lbW8uaXNSZWFkKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGRvbV8xLm1pbmlQYW5kQS5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb21fMS5taW5pUGFuZEEucmVtb3ZlQ2hpbGQoZG9tXzEubWluaVBhbmRBLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChkb21fMS5rYWRhaURpdi5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb21fMS5rYWRhaURpdi5yZW1vdmVDaGlsZChkb21fMS5rYWRhaURpdi5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkb21fMS5taW5pUGFuZEEucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGRvbV8xLmthZGFpRGl2LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBzdG9yYWdlXzEuc2F2ZVRvU3RvcmFnZShcIlRTa2FkYWlNZW1vTGlzdFwiLCBkZWxldGVkS2FkYWlNZW1vTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGNvbnRlbnRfc2NyaXB0XzEuZGlzcGxheU1pbmlQYW5kQSh1dGlsc18xLm1lcmdlTWVtb0ludG9LYWRhaUxpc3QoY29udGVudF9zY3JpcHRfMS5tZXJnZWRLYWRhaUxpc3ROb01lbW8sIGRlbGV0ZWRLYWRhaU1lbW9MaXN0KSwgY29udGVudF9zY3JpcHRfMS5sZWN0dXJlSURMaXN0LCBjb250ZW50X3NjcmlwdF8xLmZldGNoZWRUaW1lKV07XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBfZC5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnRzLmRlbGV0ZUthZGFpTWVtbyA9IGRlbGV0ZUthZGFpTWVtbztcbmZ1bmN0aW9uIGVkaXRGYXZUYWJNZXNzYWdlKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UsIGxlY3R1cmVUYWJzLCBsZWN0dXJlVGFic0NvdW50LCBpO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCBuZXcgUHJvbWlzZShmdW5jdGlvbiAocikgeyByZXR1cm4gc2V0VGltZW91dChyLCAyMDApOyB9KV07XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZhdm9yaXRlcy1tYXgtbWFya2VyXCIpWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8aSBjbGFzcz1cImZhIGZhLWJlbGwgd2FybmluZy1pY29uXCI+PC9pPkNvbWZvcnRhYmxlUGFuZEHjgavjgojjgaPjgabjgYrmsJfjgavlhaXjgornmbvpjLLjgZfjgZ88YnI+44K144Kk44OI44GM5YWo44Gm44OQ44O844Gr6L+95Yqg44GV44KM44G+44GX44Gf44CCJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlY3R1cmVUYWJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZhdi1zaXRlcy1lbnRyeVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlY3R1cmVUYWJzQ291bnQgPSBsZWN0dXJlVGFicy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVjdHVyZVRhYnNDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVjdHVyZVRhYnNbaV0uY2xhc3NMaXN0LnJlbW92ZShcInNpdGUtZmF2b3JpdGUtaXMtcGFzdC1tYXhcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY291bGQgbm90IGVkaXQgbWVzc2FnZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0cy5lZGl0RmF2VGFiTWVzc2FnZSA9IGVkaXRGYXZUYWJNZXNzYWdlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkxlY3R1cmVJbmZvID0gZXhwb3J0cy5LYWRhaSA9IGV4cG9ydHMuS2FkYWlFbnRyeSA9IHZvaWQgMDtcbnZhciBLYWRhaUVudHJ5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEthZGFpRW50cnkoa2FkYWlJRCwgYXNzaWdubWVudFRpdGxlLCBkdWVEYXRlVGltZXN0YW1wLCBpc01lbW8sIGlzRmluaXNoZWQsIGFzc2lnbm1lbnREZXRhaWwpIHtcbiAgICAgICAgdGhpcy5rYWRhaUlEID0ga2FkYWlJRDtcbiAgICAgICAgdGhpcy5hc3NpZ25tZW50VGl0bGUgPSBhc3NpZ25tZW50VGl0bGU7XG4gICAgICAgIHRoaXMuYXNzaWdubWVudERldGFpbCA9IGFzc2lnbm1lbnREZXRhaWw7XG4gICAgICAgIHRoaXMuZHVlRGF0ZVRpbWVzdGFtcCA9IGR1ZURhdGVUaW1lc3RhbXA7XG4gICAgICAgIHRoaXMuaXNNZW1vID0gaXNNZW1vO1xuICAgICAgICB0aGlzLmlzRmluaXNoZWQgPSBpc0ZpbmlzaGVkO1xuICAgIH1cbiAgICByZXR1cm4gS2FkYWlFbnRyeTtcbn0oKSk7XG5leHBvcnRzLkthZGFpRW50cnkgPSBLYWRhaUVudHJ5O1xudmFyIEthZGFpID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEthZGFpKGxlY3R1cmVJRCwgbGVjdHVyZU5hbWUsIGthZGFpRW50cmllcywgaXNSZWFkKSB7XG4gICAgICAgIHRoaXMubGVjdHVyZUlEID0gbGVjdHVyZUlEO1xuICAgICAgICB0aGlzLmxlY3R1cmVOYW1lID0gbGVjdHVyZU5hbWU7XG4gICAgICAgIHRoaXMua2FkYWlFbnRyaWVzID0ga2FkYWlFbnRyaWVzO1xuICAgICAgICB0aGlzLmlzUmVhZCA9IGlzUmVhZDtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEthZGFpLnByb3RvdHlwZSwgXCJjbG9zZXN0RHVlRGF0ZVRpbWVzdGFtcFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMua2FkYWlFbnRyaWVzLmxlbmd0aCA9PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIHZhciBtaW4gPSB0aGlzLmthZGFpRW50cmllc1swXS5kdWVEYXRlVGltZXN0YW1wO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMua2FkYWlFbnRyaWVzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IF9hW19pXTtcbiAgICAgICAgICAgICAgICBpZiAobWluID4gZW50cnkuZHVlRGF0ZVRpbWVzdGFtcCkge1xuICAgICAgICAgICAgICAgICAgICBtaW4gPSBlbnRyeS5kdWVEYXRlVGltZXN0YW1wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtaW47XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBLYWRhaS5wcm90b3R5cGUuZ2V0VG9wU2l0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMua2FkYWlFbnRyaWVzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGVudHJ5ID0gX2FbX2ldO1xuICAgICAgICAgICAgaWYgKGVudHJ5LmthZGFpUGFnZSAhPSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeS5rYWRhaVBhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gS2FkYWk7XG59KCkpO1xuZXhwb3J0cy5LYWRhaSA9IEthZGFpO1xudmFyIExlY3R1cmVJbmZvID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIExlY3R1cmVJbmZvKHRhYlR5cGUsIGxlY3R1cmVJRCwgbGVjdHVyZU5hbWUpIHtcbiAgICAgICAgdGhpcy50YWJUeXBlID0gdGFiVHlwZTtcbiAgICAgICAgdGhpcy5sZWN0dXJlSUQgPSBsZWN0dXJlSUQ7XG4gICAgICAgIHRoaXMubGVjdHVyZU5hbWUgPSBsZWN0dXJlTmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIExlY3R1cmVJbmZvO1xufSgpKTtcbmV4cG9ydHMuTGVjdHVyZUluZm8gPSBMZWN0dXJlSW5mbztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jcmVhdGVOYXZCYXJOb3RpZmljYXRpb24gPSBleHBvcnRzLnVwZGF0ZU1pbmlQYW5kQSA9IGV4cG9ydHMuYXBwZW5kTWVtb0JveCA9IGV4cG9ydHMuY3JlYXRlTWluaVBhbmRBID0gZXhwb3J0cy5jcmVhdGVIYW5idXJnZXJCdXR0b24gPSB2b2lkIDA7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIGRvbV8xID0gcmVxdWlyZShcIi4vZG9tXCIpO1xudmFyIGV2ZW50TGlzdGVuZXJfMSA9IHJlcXVpcmUoXCIuL2V2ZW50TGlzdGVuZXJcIik7XG5mdW5jdGlvbiBjcmVhdGVIYW5idXJnZXJCdXR0b24oKSB7XG4gICAgdmFyIHRvcGJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFzdExvZ2luXCIpO1xuICAgIHRyeSB7XG4gICAgICAgIHRvcGJhciA9PT0gbnVsbCB8fCB0b3BiYXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRvcGJhci5hcHBlbmRDaGlsZChkb21fMS5oYW1idXJnZXIpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImNvdWxkIG5vdCBsYXVuY2ggbWluaVBhbmRBLlwiKTtcbiAgICB9XG59XG5leHBvcnRzLmNyZWF0ZUhhbmJ1cmdlckJ1dHRvbiA9IGNyZWF0ZUhhbmJ1cmdlckJ1dHRvbjtcbmZ1bmN0aW9uIGNyZWF0ZU1pbmlQYW5kQShmZXRjaGVkVGltZSkge1xuICAgIHZhciBtaW5pUGFuZEFMb2dvID0gZG9tXzEuY3JlYXRlRWxlbShcImltZ1wiLCB7XG4gICAgICAgIGNsYXNzTmFtZTogXCJsb2dvXCIsXG4gICAgICAgIGFsdDogXCJsb2dvXCIsXG4gICAgICAgIHNyYzogY2hyb21lLmV4dGVuc2lvbi5nZXRVUkwoXCJpbWcvbG9nby5wbmdcIiksXG4gICAgfSk7XG4gICAgdmFyIG1pbmlQYW5kQUNsb3NlQnRuID0gZG9tXzEuY3JlYXRlRWxlbShcImFcIiwgeyBocmVmOiBcIiNcIiwgaWQ6IFwiY2xvc2VfYnRuXCIsIHRleHRDb250ZW50OiBcIsOXXCIgfSk7XG4gICAgbWluaVBhbmRBQ2xvc2VCdG4uY2xhc3NMaXN0LmFkZChcImNsb3NlYnRuXCIsIFwicVwiKTtcbiAgICBtaW5pUGFuZEFDbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZlbnRMaXN0ZW5lcl8xLnRvZ2dsZU1pbmlQYW5kQSk7XG4gICAgdmFyIGthZGFpVGFiID0gZG9tXzEuY3JlYXRlRWxlbShcImlucHV0XCIsIHsgdHlwZTogXCJyYWRpb1wiLCBpZDogXCJrYWRhaVRhYlwiLCBuYW1lOiBcImNwX3RhYlwiLCBjaGVja2VkOiB0cnVlIH0pO1xuICAgIGthZGFpVGFiLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudExpc3RlbmVyXzEudG9nZ2xlS2FkYWlUYWIpO1xuICAgIHZhciBrYWRhaVRhYkxhYmVsID0gZG9tXzEuY3JlYXRlRWxlbShcImxhYmVsXCIsIHsgaHRtbEZvcjogXCJrYWRhaVRhYlwiLCBpbm5lclRleHQ6IFwi6Kqy6aGM5LiA6KanXCIgfSk7XG4gICAgdmFyIGV4YW1UYWIgPSBkb21fMS5jcmVhdGVFbGVtKFwiaW5wdXRcIiwgeyB0eXBlOiBcInJhZGlvXCIsIGlkOiBcImV4YW1UYWJcIiwgbmFtZTogXCJjcF90YWJcIiwgY2hlY2tlZDogZmFsc2UgfSk7XG4gICAgZXhhbVRhYi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZlbnRMaXN0ZW5lcl8xLnRvZ2dsZUV4YW1UYWIpO1xuICAgIHZhciBleGFtVGFiTGFiZWwgPSBkb21fMS5jcmVhdGVFbGVtKFwibGFiZWxcIiwgeyBodG1sRm9yOiBcImV4YW1UYWJcIiwgaW5uZXJUZXh0OiBcIuODhuOCueODiOODu+OCr+OCpOOCuuS4gOimp1wiIH0pO1xuICAgIHZhciBhZGRNZW1vQnV0dG9uID0gZG9tXzEuY3JlYXRlRWxlbShcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJwbHVzLWJ1dHRvblwiLCBpbm5lclRleHQ6IFwiK1wiIH0pO1xuICAgIGFkZE1lbW9CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50TGlzdGVuZXJfMS50b2dnbGVNZW1vQm94LCB0cnVlKTtcbiAgICB2YXIgZmV0Y2hlZFRpbWVzdGFtcCA9IG5ldyBEYXRlKGZldGNoZWRUaW1lKTtcbiAgICB2YXIgZmV0Y2hlZFRpbWVTdHJpbmcgPSBkb21fMS5jcmVhdGVFbGVtKFwicFwiLCB7IGNsYXNzTmFtZTogXCJrYWRhaS10aW1lXCIgfSk7XG4gICAgZmV0Y2hlZFRpbWVTdHJpbmcuaW5uZXJUZXh0ID0gXCLlj5blvpfml6XmmYLvvJogXCIgKyBmZXRjaGVkVGltZXN0YW1wLnRvTG9jYWxlRGF0ZVN0cmluZygpICsgXCIgXCIgKyBmZXRjaGVkVGltZXN0YW1wLmdldEhvdXJzKCkgKyBcIjpcIiArIChcIjAwXCIgKyBmZXRjaGVkVGltZXN0YW1wLmdldE1pbnV0ZXMoKSkuc2xpY2UoLTIpICsgXCI6XCIgKyAoXCIwMFwiICsgZmV0Y2hlZFRpbWVzdGFtcC5nZXRTZWNvbmRzKCkpLnNsaWNlKC0yKTtcbiAgICBkb21fMS5hcHBlbmRDaGlsZEFsbChkb21fMS5taW5pUGFuZEEsIFtcbiAgICAgICAgbWluaVBhbmRBTG9nbyxcbiAgICAgICAgbWluaVBhbmRBQ2xvc2VCdG4sXG4gICAgICAgIGthZGFpVGFiLFxuICAgICAgICBrYWRhaVRhYkxhYmVsLFxuICAgICAgICBleGFtVGFiLFxuICAgICAgICBleGFtVGFiTGFiZWwsXG4gICAgICAgIGFkZE1lbW9CdXR0b24sXG4gICAgICAgIGZldGNoZWRUaW1lU3RyaW5nXG4gICAgXSk7XG4gICAgdmFyIHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFnZUJvZHlcIik7XG4gICAgdmFyIHJlZiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9vbE1lbnVXcmFwXCIpO1xuICAgIHBhcmVudCA9PT0gbnVsbCB8fCBwYXJlbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmVudC5pbnNlcnRCZWZvcmUoZG9tXzEubWluaVBhbmRBLCByZWYpO1xufVxuZXhwb3J0cy5jcmVhdGVNaW5pUGFuZEEgPSBjcmVhdGVNaW5pUGFuZEE7XG5mdW5jdGlvbiBhcHBlbmRNZW1vQm94KGxlY3R1cmVJRExpc3QpIHtcbiAgICB2YXIgbWVtb0VkaXRCb3ggPSBkb21fMS5jcmVhdGVFbGVtKFwiZGl2XCIpO1xuICAgIG1lbW9FZGl0Qm94LmNsYXNzTGlzdC5hZGQoXCJleGFtQm94XCIsIFwiYWRkTWVtb0JveFwiKTtcbiAgICBtZW1vRWRpdEJveC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgdmFyIG1lbW9MYWJlbCA9IGRvbV8xLmNyZWF0ZUVsZW0oXCJsYWJlbFwiKTtcbiAgICBtZW1vTGFiZWwuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICB2YXIgdG9kb0xlY0xhYmVsID0gbWVtb0xhYmVsLmNsb25lTm9kZSh0cnVlKTtcbiAgICB0b2RvTGVjTGFiZWwuaW5uZXJUZXh0ID0gXCLorJvnvqnlkI1cIjtcbiAgICB2YXIgdG9kb0xlY1NlbGVjdCA9IGRvbV8xLmNyZWF0ZUVsZW0oXCJzZWxlY3RcIiwgeyBjbGFzc05hbWU6IFwidG9kb0xlY05hbWVcIiB9KTtcbiAgICB2YXIgdG9kb0xlY09wdGlvbiA9IGRvbV8xLmNyZWF0ZUVsZW0oXCJvcHRpb25cIik7XG4gICAgZm9yICh2YXIgX2kgPSAwLCBsZWN0dXJlSURMaXN0XzEgPSBsZWN0dXJlSURMaXN0OyBfaSA8IGxlY3R1cmVJRExpc3RfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGxlY3R1cmUgPSBsZWN0dXJlSURMaXN0XzFbX2ldO1xuICAgICAgICB2YXIgY190b2RvTGVjT3B0aW9uID0gdG9kb0xlY09wdGlvbi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIGNfdG9kb0xlY09wdGlvbi50ZXh0ID0gbGVjdHVyZS5sZWN0dXJlTmFtZTtcbiAgICAgICAgY190b2RvTGVjT3B0aW9uLmlkID0gbGVjdHVyZS5sZWN0dXJlSUQ7XG4gICAgICAgIHRvZG9MZWNTZWxlY3QuYXBwZW5kQ2hpbGQoY190b2RvTGVjT3B0aW9uKTtcbiAgICB9XG4gICAgdG9kb0xlY0xhYmVsLmFwcGVuZENoaWxkKHRvZG9MZWNTZWxlY3QpO1xuICAgIHZhciB0b2RvQ29udGVudExhYmVsID0gbWVtb0xhYmVsLmNsb25lTm9kZSh0cnVlKTtcbiAgICB0b2RvQ29udGVudExhYmVsLmlubmVyVGV4dCA9IFwi44Oh44OiXCI7XG4gICAgdmFyIHRvZG9Db250ZW50SW5wdXQgPSBkb21fMS5jcmVhdGVFbGVtKFwiaW5wdXRcIiwgeyB0eXBlOiBcInRleHRcIiwgY2xhc3NOYW1lOiBcInRvZG9Db250ZW50XCIgfSk7XG4gICAgdG9kb0NvbnRlbnRMYWJlbC5hcHBlbmRDaGlsZCh0b2RvQ29udGVudElucHV0KTtcbiAgICB2YXIgdG9kb0R1ZUxhYmVsID0gbWVtb0xhYmVsLmNsb25lTm9kZSh0cnVlKTtcbiAgICB0b2RvRHVlTGFiZWwuaW5uZXJUZXh0ID0gXCLmnJ/pmZBcIjtcbiAgICB2YXIgdG9kb0R1ZUlucHV0ID0gZG9tXzEuY3JlYXRlRWxlbShcImlucHV0XCIsIHsgdHlwZTogXCJkYXRldGltZS1sb2NhbFwiLCBjbGFzc05hbWU6IFwidG9kb0R1ZVwiIH0pO1xuICAgIHRvZG9EdWVJbnB1dC52YWx1ZSA9IG5ldyBEYXRlKG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5zdWJzdHIoMCwgMTYpICsgXCItMTA6MDBcIikudG9JU09TdHJpbmcoKS5zdWJzdHIoMCwgMTYpO1xuICAgIHRvZG9EdWVMYWJlbC5hcHBlbmRDaGlsZCh0b2RvRHVlSW5wdXQpO1xuICAgIHZhciB0b2RvU3VibWl0QnV0dG9uID0gZG9tXzEuY3JlYXRlRWxlbShcImJ1dHRvblwiLCB7IHR5cGU6IFwic3VibWl0XCIsIGlkOiBcInRvZG8tYWRkXCIsIGlubmVyVGV4dDogXCLov73liqBcIiB9KTtcbiAgICB0b2RvU3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudExpc3RlbmVyXzEuYWRkS2FkYWlNZW1vLCB0cnVlKTtcbiAgICBkb21fMS5hcHBlbmRDaGlsZEFsbChtZW1vRWRpdEJveCwgW3RvZG9MZWNMYWJlbCwgdG9kb0NvbnRlbnRMYWJlbCwgdG9kb0R1ZUxhYmVsLCB0b2RvU3VibWl0QnV0dG9uXSk7XG4gICAgZG9tXzEua2FkYWlEaXYuYXBwZW5kQ2hpbGQobWVtb0VkaXRCb3gpO1xufVxuZXhwb3J0cy5hcHBlbmRNZW1vQm94ID0gYXBwZW5kTWVtb0JveDtcbmZ1bmN0aW9uIHVwZGF0ZU1pbmlQYW5kQShrYWRhaUxpc3QsIGxlY3R1cmVJRExpc3QpIHtcbiAgICB2YXIgZHVlR3JvdXBIZWFkZXJOYW1lID0gW1wi57eg44KB5YiH44KK77yS77yU5pmC6ZaT5Lul5YaFXCIsIFwi57eg44KB5YiH44KK77yV5pel5Lul5YaFXCIsIFwi57eg44KB5YiH44KK77yR77yU5pel5Lul5YaFXCIsIFwi44Gd44Gu5LuWXCJdO1xuICAgIHZhciBkdWVHcm91cENvbG9yID0gW1wiZGFuZ2VyXCIsIFwid2FybmluZ1wiLCBcInN1Y2Nlc3NcIiwgXCJvdGhlclwiXTtcbiAgICB2YXIgaW5pdExldHRlciA9IFtcImFcIiwgXCJiXCIsIFwiY1wiLCBcImRcIl07XG4gICAgdmFyIGxlY3R1cmVJRE1hcCA9IHV0aWxzXzEuY3JlYXRlTGVjdHVyZUlETWFwKGxlY3R1cmVJRExpc3QpO1xuICAgIC8vIDA6IDwyNGgsIDE6IDw1ZCwgMjogPDE0ZCwgMzogPjE0ZFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgIHZhciBlbnRyeUNvdW50ID0gMDtcbiAgICAgICAgLy8g6Imy5Yil44Gu44Kw44Or44O844OX44KS5L2c5oiQ44GZ44KLXG4gICAgICAgIHZhciBkdWVHcm91cEhlYWRlciA9IGRvbV8xLkR1ZUdyb3VwRG9tLmhlYWRlci5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIHZhciBkdWVHcm91cEhlYWRlclRpdGxlID0gZG9tXzEuRHVlR3JvdXBEb20uaGVhZGVyVGl0bGUuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBkdWVHcm91cEhlYWRlci5jbGFzc05hbWUgPSBcInNpZGVuYXYtXCIgKyBkdWVHcm91cENvbG9yW2ldO1xuICAgICAgICBkdWVHcm91cEhlYWRlci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIGR1ZUdyb3VwSGVhZGVyVGl0bGUudGV4dENvbnRlbnQgPSBcIlwiICsgZHVlR3JvdXBIZWFkZXJOYW1lW2ldO1xuICAgICAgICBkdWVHcm91cEhlYWRlci5hcHBlbmRDaGlsZChkdWVHcm91cEhlYWRlclRpdGxlKTtcbiAgICAgICAgdmFyIGR1ZUdyb3VwQ29udGFpbmVyID0gZG9tXzEuRHVlR3JvdXBEb20uY29udGFpbmVyLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgZHVlR3JvdXBDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInNpZGVuYXYtbGlzdC1cIiArIGR1ZUdyb3VwQ29sb3JbaV0pO1xuICAgICAgICBkdWVHcm91cENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIC8vIOWQhOism+e+qeOBq+OBpOOBhOOBpuODq+ODvOODl1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGthZGFpTGlzdF8xID0ga2FkYWlMaXN0OyBfaSA8IGthZGFpTGlzdF8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBrYWRhaUxpc3RfMVtfaV07XG4gICAgICAgICAgICAvLyDoqrLpoYzjgqLjgqTjg4bjg6DjgpLlhaXjgozjgovjgoTjgaTjgpLkvZzmiJBcbiAgICAgICAgICAgIHZhciBkdWVHcm91cEJvZHkgPSBkb21fMS5EdWVHcm91cERvbS5ib2R5LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIGR1ZUdyb3VwQm9keS5jbGFzc05hbWUgPSBcImthZGFpLVwiICsgZHVlR3JvdXBDb2xvcltpXTtcbiAgICAgICAgICAgIGR1ZUdyb3VwQm9keS5pZCA9IGluaXRMZXR0ZXJbaV0gKyBpdGVtLmxlY3R1cmVJRDtcbiAgICAgICAgICAgIHZhciBkdWVHcm91cExlY3R1cmVOYW1lID0gZG9tXzEuRHVlR3JvdXBEb20ubGVjdHVyZU5hbWUuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgZHVlR3JvdXBMZWN0dXJlTmFtZS5jbGFzc0xpc3QuYWRkKFwibGVjdHVyZS1cIiArIGR1ZUdyb3VwQ29sb3JbaV0sIFwibGVjdHVyZS1uYW1lXCIpO1xuICAgICAgICAgICAgZHVlR3JvdXBMZWN0dXJlTmFtZS50ZXh0Q29udGVudCA9IFwiXCIgKyBsZWN0dXJlSURNYXAuZ2V0KGl0ZW0ubGVjdHVyZUlEKTtcbiAgICAgICAgICAgIHZhciB0b3BTaXRlID0gaXRlbS5nZXRUb3BTaXRlKCk7XG4gICAgICAgICAgICBpZiAodG9wU2l0ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZHVlR3JvdXBMZWN0dXJlTmFtZS5ocmVmID0gdG9wU2l0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGR1ZUdyb3VwQm9keS5hcHBlbmRDaGlsZChkdWVHcm91cExlY3R1cmVOYW1lKTtcbiAgICAgICAgICAgIC8vIOWQhOism+e+qeOBruiqsumhjOS4gOimp+OBq+OBpOOBhOOBpuODq+ODvOODl1xuICAgICAgICAgICAgdmFyIGNudCA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBfYSA9IDAsIF9iID0gaXRlbS5rYWRhaUVudHJpZXM7IF9hIDwgX2IubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGthZGFpID0gX2JbX2FdO1xuICAgICAgICAgICAgICAgIHZhciBrYWRhaUNoZWNrYm94ID0gZG9tXzEuS2FkYWlFbnRyeURvbS5jaGVja2JveC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgdmFyIGthZGFpTGFiZWwgPSBkb21fMS5LYWRhaUVudHJ5RG9tLmxhYmVsLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB2YXIga2FkYWlEdWVEYXRlID0gZG9tXzEuS2FkYWlFbnRyeURvbS5kdWVEYXRlLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB2YXIga2FkYWlSZW1haW5UaW1lID0gZG9tXzEuS2FkYWlFbnRyeURvbS5yZW1haW5UaW1lLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB2YXIga2FkYWlUaXRsZSA9IGRvbV8xLkthZGFpRW50cnlEb20udGl0bGUuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgIHZhciBtZW1vQmFkZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgICBtZW1vQmFkZ2UuY2xhc3NMaXN0LmFkZChcImFkZC1iYWRnZVwiLCBcImFkZC1iYWRnZS1zdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgIG1lbW9CYWRnZS5pbm5lclRleHQgPSBcIuODoeODolwiO1xuICAgICAgICAgICAgICAgIHZhciBkZWxldGVCYWRnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZUJhZGdlLmNsYXNzTmFtZSA9IFwiZGVsLWJ1dHRvblwiO1xuICAgICAgICAgICAgICAgIGRlbGV0ZUJhZGdlLmlkID0ga2FkYWkua2FkYWlJRDtcbiAgICAgICAgICAgICAgICBkZWxldGVCYWRnZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZlbnRMaXN0ZW5lcl8xLmRlbGV0ZUthZGFpTWVtbywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlQmFkZ2UuaW5uZXJUZXh0ID0gXCLDl1wiO1xuICAgICAgICAgICAgICAgIHZhciBfZGF0ZSA9IG5ldyBEYXRlKGthZGFpLmR1ZURhdGVUaW1lc3RhbXAgKiAxMDAwKTtcbiAgICAgICAgICAgICAgICB2YXIgZGlzcER1ZSA9IF9kYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpICsgXCIgXCIgKyBfZGF0ZS5nZXRIb3VycygpICsgXCI6XCIgKyAoXCIwMFwiICsgX2RhdGUuZ2V0TWludXRlcygpKS5zbGljZSgtMik7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVSZW1haW4gPSB1dGlsc18xLmdldFRpbWVSZW1haW4oKGthZGFpLmR1ZURhdGVUaW1lc3RhbXAgKiAxMDAwIC0gdXRpbHNfMS5ub3dUaW1lKSAvIDEwMDApO1xuICAgICAgICAgICAgICAgIHZhciBkYXlzVW50aWxEdWUgPSB1dGlsc18xLmdldERheXNVbnRpbCh1dGlsc18xLm5vd1RpbWUsIGthZGFpLmR1ZURhdGVUaW1lc3RhbXAgKiAxMDAwKTtcbiAgICAgICAgICAgICAgICBpZiAoKGRheXNVbnRpbER1ZSA+IDAgJiYgZGF5c1VudGlsRHVlIDw9IDEgJiYgaSA9PT0gMCkgfHwgKGRheXNVbnRpbER1ZSA+IDEgJiYgZGF5c1VudGlsRHVlIDw9IDUgJiYgaSA9PT0gMSkgfHwgKGRheXNVbnRpbER1ZSA+IDUgJiYgZGF5c1VudGlsRHVlIDw9IDE0ICYmIGkgPT09IDIpIHx8IChkYXlzVW50aWxEdWUgPiAxNCAmJiBpID09PSAzKSkge1xuICAgICAgICAgICAgICAgICAgICBrYWRhaUR1ZURhdGUudGV4dENvbnRlbnQgPSBcIlwiICsgZGlzcER1ZTtcbiAgICAgICAgICAgICAgICAgICAga2FkYWlSZW1haW5UaW1lLnRleHRDb250ZW50ID0gXCJcXHUzMDQyXFx1MzA2OFwiICsgdGltZVJlbWFpblswXSArIFwiXFx1NjVFNVwiICsgdGltZVJlbWFpblsxXSArIFwiXFx1NjY0MlxcdTk1OTNcIiArIHRpbWVSZW1haW5bMl0gKyBcIlxcdTUyMDZcIjtcbiAgICAgICAgICAgICAgICAgICAga2FkYWlUaXRsZS50ZXh0Q29udGVudCA9IFwiXCIgKyBrYWRhaS5hc3NpZ25tZW50VGl0bGU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrYWRhaS5pc0ZpbmlzaGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAga2FkYWlDaGVja2JveC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAga2FkYWlDaGVja2JveC5pZCA9IGthZGFpLmthZGFpSUQ7XG4gICAgICAgICAgICAgICAgICAgIGthZGFpQ2hlY2tib3gubGVjdHVyZUlEID0gaXRlbS5sZWN0dXJlSUQ7XG4gICAgICAgICAgICAgICAgICAgIGthZGFpQ2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBldmVudExpc3RlbmVyXzEudG9nZ2xlS2FkYWlGaW5pc2hlZEZsYWcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAga2FkYWlMYWJlbC5odG1sRm9yID0ga2FkYWkua2FkYWlJRDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGthZGFpLmlzTWVtbykge1xuICAgICAgICAgICAgICAgICAgICAgICAga2FkYWlUaXRsZS50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBrYWRhaVRpdGxlLmFwcGVuZENoaWxkKG1lbW9CYWRnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBrYWRhaVRpdGxlLmFwcGVuZChrYWRhaS5hc3NpZ25tZW50VGl0bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAga2FkYWlUaXRsZS5hcHBlbmRDaGlsZChkZWxldGVCYWRnZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZG9tXzEuYXBwZW5kQ2hpbGRBbGwoZHVlR3JvdXBCb2R5LCBba2FkYWlDaGVja2JveCwga2FkYWlMYWJlbCwga2FkYWlEdWVEYXRlLCBrYWRhaVJlbWFpblRpbWUsIGthZGFpVGl0bGVdKTtcbiAgICAgICAgICAgICAgICAgICAgY250Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g5ZCE6Kyb576p44Gu6Kqy6aGM44Gn6Kmy5b2T44GZ44KL44KC44Gu44GM44GC44KL5aC05ZCI44Gv44Kw44Or44O844OX44Gr6L+95YqgXG4gICAgICAgICAgICBpZiAoY250ID4gMCkge1xuICAgICAgICAgICAgICAgIGR1ZUdyb3VwQ29udGFpbmVyLmFwcGVuZENoaWxkKGR1ZUdyb3VwQm9keSk7XG4gICAgICAgICAgICAgICAgZW50cnlDb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChlbnRyeUNvdW50ID4gMCkge1xuICAgICAgICAgICAgZHVlR3JvdXBIZWFkZXIuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgICAgICBkdWVHcm91cENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBkb21fMS5hcHBlbmRDaGlsZEFsbChkb21fMS5taW5pUGFuZEEsIFtkb21fMS5rYWRhaURpdiwgZG9tXzEuZXhhbURpdl0pO1xuICAgICAgICBkb21fMS5hcHBlbmRDaGlsZEFsbChkb21fMS5rYWRhaURpdiwgW2R1ZUdyb3VwSGVhZGVyLCBkdWVHcm91cENvbnRhaW5lcl0pO1xuICAgIH1cbiAgICAvLyDkvZXjgoLjgarjgYTmmYLjga9SZWxheFBhbmRB44KS6KGo56S644GZ44KLXG4gICAgaWYgKGthZGFpTGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdmFyIGthZGFpVGFiID0gZG9tXzEua2FkYWlEaXY7XG4gICAgICAgIHZhciByZWxheERpdiA9IGRvbV8xLmNyZWF0ZUVsZW0oXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicmVsYXhwYW5kYVwiIH0pO1xuICAgICAgICB2YXIgcmVsYXhQYW5kYVAgPSBkb21fMS5jcmVhdGVFbGVtKFwicFwiLCB7IGNsYXNzTmFtZTogXCJyZWxheHBhbmRhLXBcIiwgaW5uZXJUZXh0OiBcIuePvuWcqOihqOekuuOBp+OBjeOCi+iqsumhjOOBr+OBguOCiuOBvuOBm+OCk1wiIH0pO1xuICAgICAgICB2YXIgcmVsYXhQYW5kYUltZyA9IGRvbV8xLmNyZWF0ZUVsZW0oXCJpbWdcIiwge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiBcInJlbGF4cGFuZGEtaW1nXCIsXG4gICAgICAgICAgICBhbHQ6IFwibG9nb1wiLFxuICAgICAgICAgICAgc3JjOiBjaHJvbWUuZXh0ZW5zaW9uLmdldFVSTChcImltZy9yZWxheFBhbmRhLnBuZ1wiKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGRvbV8xLmFwcGVuZENoaWxkQWxsKHJlbGF4RGl2LCBbcmVsYXhQYW5kYVAsIHJlbGF4UGFuZGFJbWddKTtcbiAgICAgICAga2FkYWlUYWIuYXBwZW5kQ2hpbGQocmVsYXhEaXYpO1xuICAgIH1cbn1cbmV4cG9ydHMudXBkYXRlTWluaVBhbmRBID0gdXBkYXRlTWluaVBhbmRBO1xuZnVuY3Rpb24gY3JlYXRlTmF2QmFyTm90aWZpY2F0aW9uKGxlY3R1cmVJRExpc3QsIGthZGFpTGlzdCkge1xuICAgIHZhciBkZWZhdWx0VGFiID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5NcnBocy1zaXRlc05hdl9fbWVudWl0ZW1cIik7XG4gICAgdmFyIGRlZmF1bHRUYWJDb3VudCA9IE9iamVjdC5rZXlzKGRlZmF1bHRUYWIpLmxlbmd0aDtcbiAgICBmb3IgKHZhciBfaSA9IDAsIGxlY3R1cmVJRExpc3RfMiA9IGxlY3R1cmVJRExpc3Q7IF9pIDwgbGVjdHVyZUlETGlzdF8yLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgbGVjdHVyZSA9IGxlY3R1cmVJRExpc3RfMltfaV07XG4gICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKGopIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHZhciBsZWN0dXJlSUQgPSBkZWZhdWx0VGFiW2pdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJsaW5rLWNvbnRhaW5lclwiKVswXS5ocmVmLm1hdGNoKFwiKGh0dHBzPzovL1teL10rKS9wb3J0YWwvc2l0ZS1yZXNldC8oW14vXSspXCIpWzJdO1xuICAgICAgICAgICAgdmFyIHEgPSBrYWRhaUxpc3QuZmluZEluZGV4KGZ1bmN0aW9uIChrYWRhaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrYWRhaS5sZWN0dXJlSUQgPT09IGxlY3R1cmVJRDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHEgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFrYWRhaUxpc3RbcV0uaXNSZWFkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRUYWJbal0uY2xhc3NMaXN0LmFkZChcInJlZC1iYWRnZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGRheXNVbnRpbER1ZSA9IHV0aWxzXzEuZ2V0RGF5c1VudGlsKHV0aWxzXzEubm93VGltZSwga2FkYWlMaXN0W3FdLmNsb3Nlc3REdWVEYXRlVGltZXN0YW1wICogMTAwMCk7XG4gICAgICAgICAgICAgICAgdmFyIGFUYWdDb3VudCA9IGRlZmF1bHRUYWJbal0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAoZGF5c1VudGlsRHVlID4gMCAmJiBkYXlzVW50aWxEdWUgPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VGFiW2pdLmNsYXNzTGlzdC5hZGQoXCJuYXYtZGFuZ2VyXCIpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFUYWdDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VGFiW2pdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVtpXS5jbGFzc0xpc3QuYWRkKFwibmF2LWRhbmdlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChkYXlzVW50aWxEdWUgPiAxICYmIGRheXNVbnRpbER1ZSA8PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRUYWJbal0uY2xhc3NMaXN0LmFkZChcIm5hdi13YXJuaW5nXCIpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFUYWdDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VGFiW2pdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVtpXS5jbGFzc0xpc3QuYWRkKFwibmF2LXdhcm5pbmdcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF5c1VudGlsRHVlID4gNSAmJiBkYXlzVW50aWxEdWUgPD0gMTQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFRhYltqXS5jbGFzc0xpc3QuYWRkKFwibmF2LXNhZmVcIik7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYVRhZ0NvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRUYWJbal0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpW2ldLmNsYXNzTGlzdC5hZGQoXCJuYXYtc2FmZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDM7IGogPCBkZWZhdWx0VGFiQ291bnQ7IGorKykge1xuICAgICAgICAgICAgX2xvb3BfMShqKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuY3JlYXRlTmF2QmFyTm90aWZpY2F0aW9uID0gY3JlYXRlTmF2QmFyTm90aWZpY2F0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldEthZGFpT2ZMZWN0dXJlSUQgPSBleHBvcnRzLmZldGNoTGVjdHVyZUlEcyA9IHZvaWQgMDtcbnZhciBrYWRhaV8xID0gcmVxdWlyZShcIi4va2FkYWlcIik7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xuLy8gTGVjdHVyZSBJRCDjgpLjgZnjgbnjgablj5blvpfjgZnjgotcbi8vIOODjeODg+ODiOODr+ODvOOCr+mAmuS/oeOBr+ihjOOCj+OBquOBhFxuLy8gcmV0dXJucyBbZG9tYWluLCB7dGFiVHlwZSwgbGVjdHVyZUlELCBsZWN0dXJlTmFtZX1dXG5mdW5jdGlvbiBmZXRjaExlY3R1cmVJRHMoKSB7XG4gICAgdmFyIGVsZW1lbnRDb2xsZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZhdi1zaXRlcy1lbnRyeVwiKTtcbiAgICB2YXIgZWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlbGVtZW50Q29sbGVjdGlvbik7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBkb21haW4gPSBudWxsO1xuICAgIGZvciAodmFyIF9pID0gMCwgZWxlbWVudHNfMSA9IGVsZW1lbnRzOyBfaSA8IGVsZW1lbnRzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBlbGVtID0gZWxlbWVudHNfMVtfaV07XG4gICAgICAgIHZhciBsZWN0dXJlSW5mbyA9IHsgdGFiVHlwZTogXCJkZWZhdWx0XCIsIGxlY3R1cmVJRDogXCJcIiwgbGVjdHVyZU5hbWU6IFwiXCIgfTsgLy8gdGFiVHlwZeOBr1BhbmRB44Gu44OI44OD44OX44OQ44O844Gr5a2Y5Zyo44GZ44KL44GL44GX44Gq44GE44GLXG4gICAgICAgIHZhciBsZWN0dXJlID0gZWxlbVxuICAgICAgICAgICAgLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZGl2XCIpWzBdXG4gICAgICAgICAgICAuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpWzBdO1xuICAgICAgICB2YXIgbSA9IGxlY3R1cmUuaHJlZi5tYXRjaChcIihodHRwcz86Ly9bXi9dKykvcG9ydGFsL3NpdGUtcmVzZXQvKFteL10rKVwiKTtcbiAgICAgICAgaWYgKG0gJiYgbVsyXVswXSAhPT0gXCJ+XCIpIHtcbiAgICAgICAgICAgIGxlY3R1cmVJbmZvLmxlY3R1cmVJRCA9IG1bMl07XG4gICAgICAgICAgICBsZWN0dXJlSW5mby5sZWN0dXJlTmFtZSA9IGxlY3R1cmUudGl0bGU7XG4gICAgICAgICAgICByZXN1bHQucHVzaChsZWN0dXJlSW5mbyk7XG4gICAgICAgICAgICBpZiAoIWRvbWFpbikge1xuICAgICAgICAgICAgICAgIGRvbWFpbiA9IG1bMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtkb21haW4sIHJlc3VsdF07XG59XG5leHBvcnRzLmZldGNoTGVjdHVyZUlEcyA9IGZldGNoTGVjdHVyZUlEcztcbmZ1bmN0aW9uIGdldEthZGFpT2ZMZWN0dXJlSUQoYmFzZVVSTCwgbGVjdHVyZUlEKSB7XG4gICAgdmFyIHF1ZXJ5VVJMID0gYmFzZVVSTCArIFwiL2RpcmVjdC9hc3NpZ25tZW50L3NpdGUvXCIgKyBsZWN0dXJlSUQgKyBcIi5qc29uXCI7XG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcXVlcnlVUkwpO1xuICAgIC8vIOOCreODo+ODg+OCt+ODpeWvvuetllxuICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihcIlByYWdtYVwiLCBcIm5vLWNhY2hlXCIpO1xuICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihcIkNhY2hlLUNvbnRyb2xcIiwgXCJuby1jYWNoZVwiKTtcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoXCJJZi1Nb2RpZmllZC1TaW5jZVwiLCBcIlRodSwgMDEgSnVuIDE5NzAgMDA6MDA6MDAgR01UXCIpO1xuICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gXCJqc29uXCI7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIHJlcyA9IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICAgICAgICBpZiAoIXJlcyB8fCAhcmVzLmFzc2lnbm1lbnRfY29sbGVjdGlvbilcbiAgICAgICAgICAgICAgICByZWplY3QoXCI0MDQga2FkYWkgZGF0YSBub3QgZm91bmRcIik7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIga2FkYWlFbnRyaWVzID0gY29udkpzb25Ub0thZGFpRW50cmllcyhyZXMsIGJhc2VVUkwsIGxlY3R1cmVJRCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcga2FkYWlfMS5LYWRhaShsZWN0dXJlSUQsIGxlY3R1cmVJRCwgLy8gVE9ETzogbGVjdHVyZU5hbWVcbiAgICAgICAgICAgICAgICBrYWRhaUVudHJpZXMsIGZhbHNlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcbiAgICB9KTtcbn1cbmV4cG9ydHMuZ2V0S2FkYWlPZkxlY3R1cmVJRCA9IGdldEthZGFpT2ZMZWN0dXJlSUQ7XG5mdW5jdGlvbiBjb252SnNvblRvS2FkYWlFbnRyaWVzKGRhdGEsIGJhc2VVUkwsIHNpdGVJRCkge1xuICAgIHJldHVybiBkYXRhLmFzc2lnbm1lbnRfY29sbGVjdGlvblxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChqc29uKSB7IHJldHVybiBqc29uLmR1ZVRpbWUuZXBvY2hTZWNvbmQgKiAxMDAwID49IHV0aWxzXzEubm93VGltZTsgfSlcbiAgICAgICAgLm1hcChmdW5jdGlvbiAoanNvbikge1xuICAgICAgICB2YXIga2FkYWlJRCA9IGpzb24uaWQ7XG4gICAgICAgIHZhciBrYWRhaVRpdGxlID0ganNvbi50aXRsZTtcbiAgICAgICAgdmFyIGthZGFpRGV0YWlsID0ganNvbi5pbnN0cnVjdGlvbnM7XG4gICAgICAgIHZhciBrYWRhaUR1ZUVwb2NoID0ganNvbi5kdWVUaW1lLmVwb2NoU2Vjb25kO1xuICAgICAgICB2YXIgZW50cnkgPSBuZXcga2FkYWlfMS5LYWRhaUVudHJ5KGthZGFpSUQsIGthZGFpVGl0bGUsIGthZGFpRHVlRXBvY2gsIGZhbHNlLCBmYWxzZSwga2FkYWlEZXRhaWwpO1xuICAgICAgICBlbnRyeS5rYWRhaVBhZ2UgPSBiYXNlVVJMICsgXCIvcG9ydGFsL3NpdGUvXCIgKyBzaXRlSUQ7XG4gICAgICAgIHJldHVybiBlbnRyeTtcbiAgICB9KTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zYXZlVG9TdG9yYWdlID0gZXhwb3J0cy5sb2FkRnJvbVN0b3JhZ2UgPSB2b2lkIDA7XG5mdW5jdGlvbiBsb2FkRnJvbVN0b3JhZ2Uoa2V5KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KGtleSwgZnVuY3Rpb24gKGl0ZW1zKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW1zW2tleV0gPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShbXSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShpdGVtc1trZXldKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnRzLmxvYWRGcm9tU3RvcmFnZSA9IGxvYWRGcm9tU3RvcmFnZTtcbmZ1bmN0aW9uIHNhdmVUb1N0b3JhZ2Uoa2V5LCB2YWx1ZSkge1xuICAgIHZhciBlbnRpdHkgPSB7fTtcbiAgICBlbnRpdHlba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldChlbnRpdHksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlc29sdmUoXCJzYXZlZFwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnRzLnNhdmVUb1N0b3JhZ2UgPSBzYXZlVG9TdG9yYWdlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLm1lcmdlTWVtb0ludG9LYWRhaUxpc3QgPSBleHBvcnRzLmdlblVuaXF1ZVN0ciA9IGV4cG9ydHMudXNlQ2FjaGUgPSBleHBvcnRzLnVwZGF0ZUlzUmVhZEZsYWcgPSBleHBvcnRzLmNvbXBhcmVBbmRNZXJnZUthZGFpTGlzdCA9IGV4cG9ydHMuY29udmVydEFycmF5VG9LYWRhaSA9IGV4cG9ydHMubWluaVBhbmRBUmVhZHkgPSBleHBvcnRzLmlzTG9nZ2VkSW4gPSBleHBvcnRzLmNyZWF0ZUxlY3R1cmVJRE1hcCA9IGV4cG9ydHMuZ2V0VGltZVJlbWFpbiA9IGV4cG9ydHMuZ2V0RGF5c1VudGlsID0gZXhwb3J0cy5ub3dUaW1lID0gdm9pZCAwO1xudmFyIGthZGFpXzEgPSByZXF1aXJlKFwiLi9rYWRhaVwiKTtcbnZhciBzdG9yYWdlXzEgPSByZXF1aXJlKFwiLi9zdG9yYWdlXCIpO1xuZXhwb3J0cy5ub3dUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG52YXIgY2FjaGVJbnRlcnZhbCA9IDEyMDtcbmZ1bmN0aW9uIGdldERheXNVbnRpbChkdDEsIGR0Mikge1xuICAgIC8vIOe3oOOCgeWIh+OCiuOBvuOBp+OBruaXpeaVsOOCkuioiOeul+OBl+OBvuOBmVxuICAgIHZhciBkaWZmID0gKGR0MiAtIGR0MSkgLyAxMDAwO1xuICAgIGRpZmYgLz0gMzYwMCAqIDI0O1xuICAgIHJldHVybiBkaWZmO1xufVxuZXhwb3J0cy5nZXREYXlzVW50aWwgPSBnZXREYXlzVW50aWw7XG5mdW5jdGlvbiBnZXRUaW1lUmVtYWluKF9yZW1haW5UaW1lKSB7XG4gICAgdmFyIGRheSA9IE1hdGguZmxvb3IoX3JlbWFpblRpbWUgLyAoMzYwMCAqIDI0KSk7XG4gICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcigoX3JlbWFpblRpbWUgLSBkYXkgKiAzNjAwICogMjQpIC8gMzYwMCk7XG4gICAgdmFyIG1pbnV0ZXMgPSBNYXRoLmZsb29yKChfcmVtYWluVGltZSAtIChkYXkgKiAzNjAwICogMjQgKyBob3VycyAqIDM2MDApKSAvIDYwKTtcbiAgICByZXR1cm4gW2RheSwgaG91cnMsIG1pbnV0ZXNdO1xufVxuZXhwb3J0cy5nZXRUaW1lUmVtYWluID0gZ2V0VGltZVJlbWFpbjtcbmZ1bmN0aW9uIGNyZWF0ZUxlY3R1cmVJRE1hcChsZWN0dXJlSURMaXN0KSB7XG4gICAgLy8g6Kyb576pSUTjgajorJvnvqnlkI3jga5NYXDjgpLkvZzjgotcbiAgICB2YXIgbGVjdHVyZUlETWFwID0gbmV3IE1hcCgpO1xuICAgIGZvciAodmFyIF9pID0gMCwgbGVjdHVyZUlETGlzdF8xID0gbGVjdHVyZUlETGlzdDsgX2kgPCBsZWN0dXJlSURMaXN0XzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBsZWMgPSBsZWN0dXJlSURMaXN0XzFbX2ldO1xuICAgICAgICBsZWN0dXJlSURNYXAuc2V0KGxlYy5sZWN0dXJlSUQsIGxlYy5sZWN0dXJlTmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBsZWN0dXJlSURNYXA7XG59XG5leHBvcnRzLmNyZWF0ZUxlY3R1cmVJRE1hcCA9IGNyZWF0ZUxlY3R1cmVJRE1hcDtcbmZ1bmN0aW9uIGlzTG9nZ2VkSW4oKSB7XG4gICAgLy8g44Ot44Kw44Kk44Oz44GX44Gm44GE44KL44GL44Gp44GG44GL44KS6L+U44GZXG4gICAgdmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcbiAgICB2YXIgbG9nZ2VkSW4gPSBmYWxzZTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZm9yICh2YXIgX2kgPSAwLCBzY3JpcHRzXzEgPSBzY3JpcHRzOyBfaSA8IHNjcmlwdHNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIHNjcmlwdCA9IHNjcmlwdHNfMVtfaV07XG4gICAgICAgIGlmIChzY3JpcHQudGV4dC5tYXRjaCgnXCJsb2dnZWRJblwiOiB0cnVlJykpXG4gICAgICAgICAgICBsb2dnZWRJbiA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBsb2dnZWRJbjtcbn1cbmV4cG9ydHMuaXNMb2dnZWRJbiA9IGlzTG9nZ2VkSW47XG5mdW5jdGlvbiBnZXRDdXJyZW50TGVjdHVyZUlEKCkge1xuICAgIC8vIOePvuWcqOOBruODmuODvOOCuOOBruism+e+qUlE44KS6L+U44GZXG4gICAgdmFyIHVybCA9IGxvY2F0aW9uLmhyZWY7XG4gICAgdmFyIGxlY3R1cmVJRCA9IFwiXCI7XG4gICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoXCIoaHR0cHM/Oi8vW14vXSspL3BvcnRhbC9zaXRlLyhbXi9dKylcIik7XG4gICAgaWYgKHVybC5tYXRjaChyZWcpKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgbGVjdHVyZUlEID0gdXJsLm1hdGNoKHJlZylbMl07XG4gICAgfVxuICAgIHJldHVybiBsZWN0dXJlSUQ7XG59XG5mdW5jdGlvbiB1cGRhdGVJc1JlYWRGbGFnKGthZGFpTGlzdCkge1xuICAgIHZhciBsZWN0dXJlSUQgPSBnZXRDdXJyZW50TGVjdHVyZUlEKCk7XG4gICAgdmFyIHVwZGF0ZWRLYWRhaUxpc3QgPSBbXTtcbiAgICBpZiAobGVjdHVyZUlEICYmIGxlY3R1cmVJRC5sZW5ndGggPj0gMTcpIHtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBrYWRhaUxpc3RfMSA9IGthZGFpTGlzdDsgX2kgPCBrYWRhaUxpc3RfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBrYWRhaSA9IGthZGFpTGlzdF8xW19pXTtcbiAgICAgICAgICAgIGlmIChrYWRhaS5sZWN0dXJlSUQgPT09IGxlY3R1cmVJRCkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZWRLYWRhaUxpc3QucHVzaChuZXcga2FkYWlfMS5LYWRhaShrYWRhaS5sZWN0dXJlSUQsIGthZGFpLmxlY3R1cmVOYW1lLCBrYWRhaS5rYWRhaUVudHJpZXMsIHRydWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHVwZGF0ZWRLYWRhaUxpc3QucHVzaChrYWRhaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3RvcmFnZV8xLnNhdmVUb1N0b3JhZ2UoXCJUU2thZGFpTGlzdFwiLCB1cGRhdGVkS2FkYWlMaXN0KTtcbiAgICB9XG59XG5leHBvcnRzLnVwZGF0ZUlzUmVhZEZsYWcgPSB1cGRhdGVJc1JlYWRGbGFnO1xuZnVuY3Rpb24gbWluaVBhbmRBUmVhZHkoKSB7XG4gICAgLy8g44Ot44O844OJ6KGo56S644KS5YiH44KK5pu/44GI44GmM+acrOe3muihqOekuuOBq+OBmeOCi1xuICAgIHZhciBoYW1idXJnZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibG9hZGVyXCIpWzBdO1xuICAgIGhhbWJ1cmdlci5jbGFzc05hbWUgPSBcIlwiO1xuICAgIGhhbWJ1cmdlci5pZCA9IFwiaGFtYnVyZ2VyXCI7XG4gICAgaGFtYnVyZ2VyLnRleHRDb250ZW50ID0gXCLimLBcIjtcbn1cbmV4cG9ydHMubWluaVBhbmRBUmVhZHkgPSBtaW5pUGFuZEFSZWFkeTtcbmZ1bmN0aW9uIGNvbnZlcnRBcnJheVRvS2FkYWkoYXJyKSB7XG4gICAgdmFyIGthZGFpTGlzdCA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMCwgYXJyXzEgPSBhcnI7IF9pIDwgYXJyXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBpID0gYXJyXzFbX2ldO1xuICAgICAgICB2YXIga2FkYWlFbnRyaWVzID0gW107XG4gICAgICAgIGZvciAodmFyIF9hID0gMCwgX2IgPSBpLmthZGFpRW50cmllczsgX2EgPCBfYi5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgIHZhciBlID0gX2JbX2FdO1xuICAgICAgICAgICAgdmFyIGVudHJ5ID0gbmV3IGthZGFpXzEuS2FkYWlFbnRyeShlLmthZGFpSUQsIGUuYXNzaWdubWVudFRpdGxlLCBlLmR1ZURhdGVUaW1lc3RhbXAsIGUuaXNNZW1vLCBlLmlzRmluaXNoZWQsIGUuYXNzaWdubWVudERldGFpbCk7XG4gICAgICAgICAgICBlbnRyeS5rYWRhaVBhZ2UgPSBlLmthZGFpUGFnZTtcbiAgICAgICAgICAgIGthZGFpRW50cmllcy5wdXNoKGVudHJ5KTtcbiAgICAgICAgfVxuICAgICAgICBrYWRhaUxpc3QucHVzaChuZXcga2FkYWlfMS5LYWRhaShpLmxlY3R1cmVJRCwgaS5sZWN0dXJlTmFtZSwga2FkYWlFbnRyaWVzLCBpLmlzUmVhZCkpO1xuICAgIH1cbiAgICByZXR1cm4ga2FkYWlMaXN0O1xufVxuZXhwb3J0cy5jb252ZXJ0QXJyYXlUb0thZGFpID0gY29udmVydEFycmF5VG9LYWRhaTtcbmZ1bmN0aW9uIGNvbXBhcmVBbmRNZXJnZUthZGFpTGlzdChvbGRLYWRhaUxpc3QsIG5ld0thZGFpTGlzdCkge1xuICAgIHZhciBtZXJnZWRLYWRhaUxpc3QgPSBbXTtcbiAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChuZXdLYWRhaSkge1xuICAgICAgICB2YXIgaWR4ID0gb2xkS2FkYWlMaXN0LmZpbmRJbmRleChmdW5jdGlvbiAob2xkS2FkYWkpIHtcbiAgICAgICAgICAgIHJldHVybiAob2xkS2FkYWkubGVjdHVyZUlEID09PSBuZXdLYWRhaS5sZWN0dXJlSUQpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8g44KC44GX6YGO5Y6744Gr5L+d5a2Y44GX44Gf6Kqy6aGM44Oq44K544OI44Gu5Lit44Gr6Kyb576pSUTjgYzlrZjlnKjjgZfjgarjgYTmmYJcbiAgICAgICAgaWYgKGlkeCA9PT0gLTEpIHtcbiAgICAgICAgICAgIC8vIOacquiqreODleODqeOCsOOCkueri+OBpuOBpuODnuODvOOCuFxuICAgICAgICAgICAgdmFyIGlzUmVhZCA9IG5ld0thZGFpLmthZGFpRW50cmllcy5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICBuZXdLYWRhaS5rYWRhaUVudHJpZXMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYS5kdWVEYXRlVGltZXN0YW1wIC0gYi5kdWVEYXRlVGltZXN0YW1wOyB9KTtcbiAgICAgICAgICAgIG1lcmdlZEthZGFpTGlzdC5wdXNoKG5ldyBrYWRhaV8xLkthZGFpKG5ld0thZGFpLmxlY3R1cmVJRCwgbmV3S2FkYWkubGVjdHVyZU5hbWUsIG5ld0thZGFpLmthZGFpRW50cmllcywgaXNSZWFkKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8g6YGO5Y6744Gr5L+d5a2Y44GX44Gf6Kqy6aGM44Oq44K544OI44Gu5Lit44Gr6Kyb576pSUTjgYzlrZjlnKjjgZnjgovmmYJcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyDmnKroqq3jg5Xjg6njgrDjgpLlvJXjgY3ntpnjgZBcbiAgICAgICAgICAgIHZhciBpc1JlYWQgPSBvbGRLYWRhaUxpc3RbaWR4XS5pc1JlYWQ7XG4gICAgICAgICAgICB2YXIgbWVyZ2VkS2FkYWlFbnRyaWVzID0gW107XG4gICAgICAgICAgICB2YXIgX2xvb3BfMiA9IGZ1bmN0aW9uIChuZXdLYWRhaUVudHJ5KSB7XG4gICAgICAgICAgICAgICAgLy8g5paw44GX44GP5Y+W5b6X44GX44Gf6Kqy6aGM44GM5L+d5a2Y44GV44KM44Gf6Kqy6aGM5LiA6Kan44Gu5Lit44Gr44GC44KL44GL5o6i44GZXG4gICAgICAgICAgICAgICAgdmFyIHEgPSBvbGRLYWRhaUxpc3RbaWR4XS5rYWRhaUVudHJpZXMuZmluZEluZGV4KGZ1bmN0aW9uIChvbGRLYWRhaUVudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAob2xkS2FkYWlFbnRyeS5rYWRhaUlEID09PSBuZXdLYWRhaUVudHJ5LmthZGFpSUQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIOOCguOBl+OBquOBkeOCjOOBsOaWsOimj+iqsumhjOOBquOBruOBp+acquiqreODleODqeOCsOOCkueri+OBpuOCi1xuICAgICAgICAgICAgICAgIGlmIChxID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpc1JlYWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VkS2FkYWlFbnRyaWVzLnB1c2gobmV3S2FkYWlFbnRyeSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZW50cnkgPSBuZXcga2FkYWlfMS5LYWRhaUVudHJ5KG5ld0thZGFpRW50cnkua2FkYWlJRCwgbmV3S2FkYWlFbnRyeS5hc3NpZ25tZW50VGl0bGUsIG5ld0thZGFpRW50cnkuZHVlRGF0ZVRpbWVzdGFtcCwgbmV3S2FkYWlFbnRyeS5pc01lbW8sIG9sZEthZGFpTGlzdFtpZHhdLmthZGFpRW50cmllc1txXS5pc0ZpbmlzaGVkLCBuZXdLYWRhaUVudHJ5LmFzc2lnbm1lbnREZXRhaWwpO1xuICAgICAgICAgICAgICAgICAgICBlbnRyeS5rYWRhaVBhZ2UgPSBuZXdLYWRhaUVudHJ5LmthZGFpUGFnZTtcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VkS2FkYWlFbnRyaWVzLnB1c2goZW50cnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gbmV3S2FkYWkua2FkYWlFbnRyaWVzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciBuZXdLYWRhaUVudHJ5ID0gX2FbX2ldO1xuICAgICAgICAgICAgICAgIF9sb29wXzIobmV3S2FkYWlFbnRyeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDmnKroqq3jg5Xjg6njgrDpg6jliIbjgpLlpInmm7TjgZfjgabjg57jg7zjgrhcbiAgICAgICAgICAgIG1lcmdlZEthZGFpRW50cmllcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhLmR1ZURhdGVUaW1lc3RhbXAgLSBiLmR1ZURhdGVUaW1lc3RhbXA7IH0pO1xuICAgICAgICAgICAgbWVyZ2VkS2FkYWlMaXN0LnB1c2gobmV3IGthZGFpXzEuS2FkYWkobmV3S2FkYWkubGVjdHVyZUlELCBuZXdLYWRhaS5sZWN0dXJlTmFtZSwgbWVyZ2VkS2FkYWlFbnRyaWVzLCBpc1JlYWQpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8g5pyA5paw44Gu6Kqy6aGM44Oq44K544OI44KS44KC44Go44Gr44Oe44O844K444GZ44KLXG4gICAgZm9yICh2YXIgX2kgPSAwLCBuZXdLYWRhaUxpc3RfMSA9IG5ld0thZGFpTGlzdDsgX2kgPCBuZXdLYWRhaUxpc3RfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIG5ld0thZGFpID0gbmV3S2FkYWlMaXN0XzFbX2ldO1xuICAgICAgICBfbG9vcF8xKG5ld0thZGFpKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlZEthZGFpTGlzdDtcbn1cbmV4cG9ydHMuY29tcGFyZUFuZE1lcmdlS2FkYWlMaXN0ID0gY29tcGFyZUFuZE1lcmdlS2FkYWlMaXN0O1xuZnVuY3Rpb24gbWVyZ2VNZW1vSW50b0thZGFpTGlzdChrYWRhaUxpc3QsIGthZGFpTWVtb0xpc3QpIHtcbiAgICB2YXIgbWVyZ2VkS2FkYWlMaXN0ID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAwLCBrYWRhaUxpc3RfMiA9IGthZGFpTGlzdDsgX2kgPCBrYWRhaUxpc3RfMi5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGthZGFpID0ga2FkYWlMaXN0XzJbX2ldO1xuICAgICAgICBtZXJnZWRLYWRhaUxpc3QucHVzaChuZXcga2FkYWlfMS5LYWRhaShrYWRhaS5sZWN0dXJlSUQsIGthZGFpLmxlY3R1cmVOYW1lLCBrYWRhaS5rYWRhaUVudHJpZXMsIGthZGFpLmlzUmVhZCkpO1xuICAgIH1cbiAgICB2YXIgX2xvb3BfMyA9IGZ1bmN0aW9uIChrYWRhaU1lbW8pIHtcbiAgICAgICAgdmFyIGlkeCA9IGthZGFpTGlzdC5maW5kSW5kZXgoZnVuY3Rpb24gKGthZGFpKSB7XG4gICAgICAgICAgICByZXR1cm4gKGthZGFpTWVtby5sZWN0dXJlSUQgPT09IGthZGFpLmxlY3R1cmVJRCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgbWVyZ2VkS2FkYWlMaXN0W2lkeF0ua2FkYWlFbnRyaWVzID0gbWVyZ2VkS2FkYWlMaXN0W2lkeF0ua2FkYWlFbnRyaWVzLmNvbmNhdChrYWRhaU1lbW8ua2FkYWlFbnRyaWVzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1lcmdlZEthZGFpTGlzdC5wdXNoKG5ldyBrYWRhaV8xLkthZGFpKGthZGFpTWVtby5sZWN0dXJlSUQsIGthZGFpTWVtby5sZWN0dXJlTmFtZSwga2FkYWlNZW1vLmthZGFpRW50cmllcywgdHJ1ZSkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBmb3IgKHZhciBfYSA9IDAsIGthZGFpTWVtb0xpc3RfMSA9IGthZGFpTWVtb0xpc3Q7IF9hIDwga2FkYWlNZW1vTGlzdF8xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICB2YXIga2FkYWlNZW1vID0ga2FkYWlNZW1vTGlzdF8xW19hXTtcbiAgICAgICAgX2xvb3BfMyhrYWRhaU1lbW8pO1xuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VkS2FkYWlMaXN0O1xufVxuZXhwb3J0cy5tZXJnZU1lbW9JbnRvS2FkYWlMaXN0ID0gbWVyZ2VNZW1vSW50b0thZGFpTGlzdDtcbmZ1bmN0aW9uIHVzZUNhY2hlKGZldGNoZWRUaW1lKSB7XG4gICAgcmV0dXJuIChleHBvcnRzLm5vd1RpbWUgLSBmZXRjaGVkVGltZSkgLyAxMDAwID4gY2FjaGVJbnRlcnZhbDtcbn1cbmV4cG9ydHMudXNlQ2FjaGUgPSB1c2VDYWNoZTtcbmZ1bmN0aW9uIGdlblVuaXF1ZVN0cigpIHtcbiAgICByZXR1cm4gXCJtXCIgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygxNikgKyBNYXRoLmZsb29yKDEyMzQ1NiAqIE1hdGgucmFuZG9tKCkpLnRvU3RyaW5nKDE2KTtcbn1cbmV4cG9ydHMuZ2VuVW5pcXVlU3RyID0gZ2VuVW5pcXVlU3RyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jb250ZW50X3NjcmlwdC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=