import { nextFlowId, cloneObj, findFlow, findConditions } from '../utils'
import { RESIZE_HOT_PANE, RESIZE_GRAPH_PANE, LOAD_STATE, SET_ELEMENTS_POSITION, CONNECT_FLOW, REMOVE_FLOW, CHANGE_POSITION, ADD_BRANCH_FLOW, ADD_PAGE_FLOW, REMOVE_EDGE, CHANGE_DEFS, SELECT_FLOW} from '../constants'

function addFlow(state, x, y, type) {
  const flowId = nextFlowId(state);
  state.defs.positionDefs.push({ flowId, x, y });
  state.defs.flowDefs.push({ id: flowId, type: type });
  return state;
}
function removeEdge(state, sourceFlowId, targetFlowId) {
  const sourceFlow = findFlow(state, sourceFlowId);
  if (sourceFlow.type === 'page') {
    sourceFlow.nextFlowId = null;
  } else if (sourceFlow.type === 'branch') {
    const targetCondition = findConditions(state, sourceFlowId).find((def) => {
      return def.nextFlowId === targetFlowId;
    });
    targetCondition.nextFlowId = null;
  } else {
    throw "unkown flow type: " + sourceFlow.type;
  }
  return state;
}
function changePosition(state, flowId, x, y) {
  const pos = state.defs.positionDefs.find((def) => {
    return def.flowId === flowId;
  });
  if (pos) {
    pos.x = x;
    pos.y = y;
  } else {
    state.defs.positionDefs.push({ flowId, x, y });
  }
  return state;
}
/** flowを削除する */
function removeFlow(state, flowId) {
  const flowDefs = state.defs.flowDefs;
  const index = flowDefs.findIndex((def) => { return def.id === flowId; });
  flowDefs.splice(index, 1);
  return state;
}
/** Flowを接続する */
function connectFlow(state, sourceFlowId, dstFlowId) {
  let sourceFlow = findFlow(state, sourceFlowId);
  if (sourceFlow.type === 'page') {
    sourceFlow.nextFlowId = dstFlowId;
  } else if (sourceFlow.type === 'branch') {
    state.defs.conditionDefs.push({
      flowId: sourceFlow.id,
      type: 'if',
      nextFlowId: dstFlowId
    });
  } else {
    // デフォルトはpage
    throw 'unknown flow type: ' + sourceFlow.type;
  }
  return state;
}
/** elementのpositionを全て設定する */
function setElementsPosition(state, positions) {
  state.defs.positionDefs = positions;
  return state;
}
/** graphPaneをリサイズする */
function resizeGraphPane(state, width) {
  state.viewSettings.graphWidth = width;
  return state;
}
/** hotPaneをリサイズする */
function resizeHotPane(state, height) {
  state.viewSettings.hotHeight = height;
  return state;
}

export default function reducer(state, action) {
  let newState = cloneObj(state);
  switch (action.type) {
  case CHANGE_DEFS:
    newState.defs[action.defsName] = cloneObj(action.defs);
    return newState;
  case SELECT_FLOW:
    newState.values.currentFlowId = action.flowId;
    return newState;
  case ADD_PAGE_FLOW:
    return addFlow(newState, action.x, action.y, 'page');
  case ADD_BRANCH_FLOW:
    return addFlow(newState, action.x, action.y, 'branch');
  case REMOVE_EDGE:
    return removeEdge(newState, action.sourceFlowId, action.targetFlowId);
  case REMOVE_FLOW:
    return removeFlow(newState, action.flowId);
  case CHANGE_POSITION:
    return changePosition(newState, action.flowId, action.x, action.y);
  case CONNECT_FLOW:
    return connectFlow(newState, action.sourceFlowId, action.dstFlowId);
  case SET_ELEMENTS_POSITION:
    return setElementsPosition(newState, action.positions);
  case LOAD_STATE:
    return action.state;
  case RESIZE_GRAPH_PANE:
    return resizeGraphPane(newState, action.graphWidth);
  case RESIZE_HOT_PANE:
    return resizeHotPane(newState, action.hotHeight);
  default:
    return newState;
  }
}
