import { CHANGE_FLOW_DEFS } from './constants'
export function changeFlowDefs(flowDefs, fromHOT) {
  return {
    type: CHANGE_FLOW_DEFS,
    fromHOT: !!fromHOT
  };
}
