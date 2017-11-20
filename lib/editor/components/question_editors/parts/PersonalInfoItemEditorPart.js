/* eslint-env browser */
import { DragSource, DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { DND_ITEM } from '../../../../constants/dnd';
import PersonalInfoItemEditor, { conditionSource, conditionTarget, stateToProps, actionsToProps } from '../PersonalInfoItemEditor';

/** questionのitemsを編集する際に使用するeditor */
class PersonalItemEditorPart extends PersonalInfoItemEditor {
}

const DropTargetPersonalItemEditorPart = DropTarget(
  DND_ITEM,
  conditionTarget,
  dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }),
)(PersonalItemEditorPart);
const DragSourcePersonalItemEditorPart = DragSource(
  DND_ITEM,
  conditionSource,
  (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    dragging: monitor.isDragging(),
  }),
)(DropTargetPersonalItemEditorPart);
export default connect(stateToProps, actionsToProps)(DragSourcePersonalItemEditorPart);
