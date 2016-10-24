import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ComponentButton from './ComponentButton'
import CheckboxEditor from './question_editor/CheckboxEditor'
import * as Utils from '../../utils'

class ComponentList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { state } = this.props;
    const page = Utils.findPageFromFlow(state, state.values.currentFlowId);
    // ページが見つからない場合は描画しない(branchの場合)
    if (!page) {
      const branch = Utils.findBranchFromFlow(state, state.values.currentFlowId);
      if (branch) {
        return <span>Disabled ComponentList Tab when branch is selected</span>;
      } else {
        throw 'invalid currentFlowId: ' + state.values.currentFlowId;
      }
    }

    return (
      <div className="form-container">
        <ComponentButton component={CheckboxEditor}   componentGroup="question"     label="複数選択肢"/>
        <ComponentButton component="radio"            componentGroup="question"     label="単一選択肢"/>
        <ComponentButton component="select"           componentGroup="question"     label="ドロップダウン"/>
        <ComponentButton component="matrix"           componentGroup="question"     label="マトリクス"/>
        <ComponentButton component="text"             componentGroup="question"     label="1行テキスト"/>
        <ComponentButton component="textarea"         componentGroup="question"     label="複数行テキスト"/>
        <ComponentButton component="description"      componentGroup="non-question" label="テキスト"/>
        <ComponentButton component="image"            componentGroup="non-question" label="画像"/>
      </div>
    );
  }
}

const stateToProps = state => ({
  state: state
});
const actionsToProps = dispatch => ({
});

export default connect(
  stateToProps,
  actionsToProps
)(ComponentList);
