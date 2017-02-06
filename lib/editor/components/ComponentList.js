import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ComponentButton from './ComponentButton';
import CheckboxEditor from './question_editor/CheckboxEditor';

class ComponentList extends PureComponent {
  render() {
    const { state } = this.props;
    const flow = state.findCurrentNode();
    if (flow.isPage()) {
      return <span>Disabled ComponentList Tab when branch is selected</span>;
    }

    return (
      <div className="form-container">
        <ComponentButton component={CheckboxEditor} componentGroup="question" label="複数選択肢" />
        <ComponentButton component="radio" componentGroup="question" label="単一選択肢" />
        <ComponentButton component="select" componentGroup="question" label="ドロップダウン" />
        <ComponentButton component="matrix" componentGroup="question" label="マトリクス" />
        <ComponentButton component="text" componentGroup="question" label="1行テキスト" />
        <ComponentButton component="textarea" componentGroup="question" label="複数行テキスト" />
        <ComponentButton component="description" componentGroup="non-question" label="テキスト" />
        <ComponentButton component="image" componentGroup="non-question" label="画像" />
      </div>
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
});

export default connect(
  stateToProps,
  actionsToProps,
)(ComponentList);
