import { NEXT_PAGE, PREV_PAGE, VALUE_CHANGE } from './constants'
export function nextPage() {
  return {
    type: NEXT_PAGE
  };
}
export function prevPage() {
  return {
    type: PREV_PAGE
  };
}
export function valueChange(itemName, value) {
  return { type: VALUE_CHANGE, itemName, value };
}
