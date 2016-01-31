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

/** stateからpageを探す */
export function findPage(state, pageId) {
  return state.pageDefs.find((def) => def.id === pageId);
}
