import { CHANGE_DEFS } from './constants'
export function changeDefs(defsName, defs) {
  return {
    type: CHANGE_DEFS,
    defsName: defsName,
    defs: defs
  };
}
