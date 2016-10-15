import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap';
import * as EditorActions from '../actions'
import * as Utils from '../../utils'

class ComponentButton extends Component {
  constructor(props) {
    super(props);
  }
  onButtonClick(e) {
    const { component, addComponent } = this.props;
    addComponent(component);
  }
  render() {
    const { label, componentGroup } = this.props;
    return (
      <Button bsStyle={ComponentButton.TYPE_MAPPING[componentGroup]} className="component-button" block onClick={this.onButtonClick.bind(this)}>{label}</Button>
    );
  }
}
// typeとBootstrapのclassの紐つけ
ComponentButton.TYPE_MAPPING = {
  'question': 'info',
  'non-question': 'success'
};

ComponentButton.defaultProps = {
};

ComponentButton.propTypes = {
};

const stateToProps = state => ({
  state: state
});
const actionsToProps = dispatch => ({
  addComponent: comopnentType => dispatch(EditorActions.addComponent(comopnentType))
});

export default connect(
  stateToProps,
  actionsToProps
)(ComponentButton);
