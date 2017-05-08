/* eslint-env browser */
import { DragSource, DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { DND_ITEM } from '../../../../constants/dnd';
import BaseItemEditor, { conditionSource, conditionTarget, stateToProps, actionsToProps } from '../BaseItemEditor';

/** questionのitemsを編集する際に使用するeditor */
class ItemEditorPart extends BaseItemEditor {
}

const DropTargetItemEditorPart = DropTarget(
  DND_ITEM,
  conditionTarget,
  dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }),
)(ItemEditorPart);
const DragSourceItemEditorPart = DragSource(
  DND_ITEM,
  conditionSource,
  (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    dragging: monitor.isDragging(),
  }),
)(DropTargetItemEditorPart);
export default connect(stateToProps, actionsToProps)(DragSourceItemEditorPart);
