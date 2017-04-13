/* eslint-env browser,jquery */
/** class名にマッチする親の要素を探す */
export function findParentByClassName(parentNode, className) {
  let node = parentNode;
  for (;;) {
    node = node.parentNode;
    if (!node || !node.classList) return null;
    if (node.classList.contains(className)) {
      return node;
    }
  }
}

/** parseIntのwrapper。NaNだった場合にはdefaultValueを返す */
export function parseInteger(str, defaultValue = 0) {
  const num = parseInt(str, 10);
  return isNaN(num) ? defaultValue : num;
}

/** PC表示かSP表示かを判定する */
export function isSP() {
  const classList = document.body.classList;
  return classList.contains('m3-enquete__user-agent-group--SP') || classList.contains('m3-enquete__user-agent-group--APP');
}
