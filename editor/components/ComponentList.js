import React, { Component, PropTypes } from 'react'
import ComponentButton from './ComponentButton'
import * as Utils from '../../utils'

export default class ComponentList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { } = this.props;
    return (
      <div className="component-list">
        <ComponentButton label="複数選択肢"/>
        <ComponentButton label="単一選択肢"/>
        <ComponentButton label="ドロップダウン"/>
        <ComponentButton label="マトリクス"/>
        <ComponentButton label="1行テキスト"/>
        <ComponentButton label="複数行テキスト"/>
      </div>
    );
  }
}

ComponentList.defaultProps = {
};

ComponentList.propTypes = {
};
