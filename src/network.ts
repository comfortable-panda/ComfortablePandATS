function fetchLectureIDs(): Array<string> {
  const elementCollection = document.getElementsByClassName("list-container");
  const elements = Array.prototype.slice.call(elementCollection);
  const result = [];
  for (const elem of elements) {
    const m = elem.href.match("https?:\/\/[^/]+\/portal\/site\/([^/]+)");
    if (m) {
      result.push(m[1]);
    }
  }
  return result;
}
