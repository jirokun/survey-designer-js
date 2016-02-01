import CheckboxItem from './components/items/CheckboxItem'
import RadioItem from './components/items/RadioItem'
import TextItem from './components/items/TextItem'

let items = {
  CheckboxItem,
  RadioItem,
  TextItem
};
/**
 * Itemを探す
 *
 * まず最初にitemsを探し、その後windowを探す
 */
export function findItem(name) {
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
