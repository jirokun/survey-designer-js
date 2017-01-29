import React, { Component } from 'react';
import { connect } from 'react-redux';
import VisualEditor from './VisualEditor';
import * as EditorActions from '../actions';

class Editor extends Component {
  render() {
    return (
      <div className="editor-pane">
        <VisualEditor />
      </div>
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  changeCodemirror: value => dispatch(EditorActions.changeCodemirror(value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Editor);
