import * as Utils from '../utils';
import * as C from '../constants';
import runtimeReducer from '../runtime/reducers';

// ページを複製する
function clonePage(state, nodeId, x, y) {
  const node = Utils.findNode(state, nodeId);
  const clonedNode = Utils.cloneObj(node);
  clonedNode.id = Utils.generateNextId(state, 'node');
  state.survey.nodes.push(clonedNode);
  state.survey.positionDefs.push({ nodeId: clonedNode.id, x, y });
  return state;
}
function removeEdge(state, sourceNodeId, targetNodeId) {
  const sourceNode = Utils.findNode(state, sourceNodeId);
  if (sourceNode.type === 'page') {
    sourceNode.nextNodeId = null;
  } else if (sourceNode.type === 'branch') {
    const branchDef = Utils.findBranch(state, sourceNodeId);
    const targetIndex = branchDef.conditions.findIndex(def => def.nextNodeId === targetNodeId);
    branchDef.conditions.splice(targetIndex, 1);
  } else {
    throw `unkown node type: ${sourceNode.type}`;
  }
  return state;
}

// 分岐定義を変更
function changeBranch(state, branchId, newBranch) {
  const branch = Utils.findBranch(state, branchId);
  for (const prop in branch) {
    if (prop === 'id' || prop === 'type') continue;
    delete branch[prop];
  }
  Object.assign(branch, newBranch);
  return state;
}

// 分岐条件の順番を入れ替える
function moveCondition(state, branchId, sourceIndex, toIndex) {
  const branch = Utils.findBranch(state, branchId);
  const targetCondition = branch.conditions[sourceIndex];
  branch.conditions[sourceIndex] = branch.conditions[toIndex];
  branch.conditions[toIndex] = targetCondition;
  return state;
}

/** Nodeを接続する */
function connectNode(state, sourceNodeId, dstNodeId) {
  const sourceNode = Utils.findNode(state, sourceNodeId);
  if (sourceNode.type === 'page') {
    sourceNode.nextNodeId = dstNodeId;
  } else if (sourceNode.type === 'branch') {
    state.survey.branches.push({
      nodeId: sourceNode.id,
      type: 'if',
      nextNodeId: dstNodeId,
    });
  } else {
    // デフォルトはpage
    throw `unknown node type: ${sourceNode.type}`;
  }
  return state;
}

function editorReducer(state, action) {
  switch (action.type) {
    case C.SELECT_NODE:
      return state.setCurrentNodeId(action.nodeId);
    case C.ADD_NODE:
      return state.addNode(action.index, action.nodeType);
    case C.CLONE_PAGE:
      return clonePage(state, action.nodeId, action.x, action.y);
    case C.REMOVE_EDGE:
      return removeEdge(state, action.sourceNodeId, action.targetNodeId);
    case C.REMOVE_NODE:
      return state.deleteNode(action.nodeId);
    case C.MOVE_CONDITION:
      return state.moveCondition(action.nodeId, action.fromIndex, action.toIndex);
    case C.CONNECT_NODE:
      return connectNode(state, action.sourceNodeId, action.dstNodeId);
    case C.CHANGE_PAGE:
      return state.updatePage(action.pageId, action.page);
    case C.CHANGE_QUESTION_ATTRIBUTE:
      return state.updateQuestionAttribute(action.pageId, action.questionId, action.attributeName, action.value, action.subValue);
    case C.CHANGE_SHOW_PANE:
      return state.updateShowPane(action.paneName, action.show);
    case C.ADD_QUESTION:
      return state.addQuestion(action.questionClassName, action.pageId, action.index);
    default:
      return state;
  }
}
export default function reducer(state, action) {
  // runtimeとeditorのreducerを両方実行する
  return runtimeReducer(editorReducer(state, action), action);
}
