/* eslint-env browser */
import { DragSource, DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { DND_SUB_ITEM } from '../../../constants/dnd';
import BaseItemEditor, { conditionSource, conditionTarget, stateToProps, actionsToProps } from './BaseItemEditor';

/** questionのsubItemsを編集する際に使用するeditor */
class SubItemEditor extends BaseItemEditor {
}

const DropTargetItemEditor = DropTarget(
  DND_SUB_ITEM,
  conditionTarget,
  dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }),
)(SubItemEditor);
const DragSourceItemEditor = DragSource(
  DND_SUB_ITEM,
  conditionSource,
  (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    dragging: monitor.isDragging(),
  }),
)(DropTargetItemEditor);
export default connect(stateToProps, actionsToProps)(DragSourceItemEditor);
