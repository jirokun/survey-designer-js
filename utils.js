import CheckboxItem from './runtime/components/items/CheckboxItem'
import RadioItem from './runtime/components/items/RadioItem'
import TextItem from './runtime/components/items/TextItem'

/**
 * Itemを探す
 *
 * まず最初にitemsを探し、その後windowを探す
 */
export function findItemConstructor(name) {
  let items = {
    CheckboxItem,
    RadioItem,
    TextItem
  };
  if (items[name]) return items[name];
  else if (typeof(window) !== 'undefined' && window[name]) return window[name];
  else throw 'Item is not defined: ' + name;
}

/** stateからflowを探す */
export function findFlow(state, flowId) {
  return state.defs.flowDefs.find((def) => def.id === flowId);
}
/** stateからpageを探す */
export function findPage(state, pageId) {
  return state.defs.pageDefs.find((def) => def.id === pageId);
}
/** stateからquestionを探す */
export function findQuestion(state, questionId) {
  return state.defs.questionDefs.find((def) => def.id === questionId);
}
/** stateからpageIdに紐つくquestionを探す */
export function findQuestions(state, pageId) {
  return state.defs.questionDefs.filter((def) => def.pageId === pageId);
}
/** stateからquestionIdに紐つくitemを探す */
export function findItems(state, questionId) {
  return state.defs.itemDefs.filter((def) => def.questionId === questionId);
}
/** stateからitemIdに紐つくchoiceを探す */
export function findChoices(state, itemId) {
  return state.defs.choiceDefs.filter((def) => def.itemId === itemId);
}
/** stateからconditionを探す */
export function findConditions(state, flowId) {
  return state.defs.conditionDefs.filter((def) => def.flowId === flowId);
}
