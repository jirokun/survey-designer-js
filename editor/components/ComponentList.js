import React, { Component, PropTypes } from 'react'
import ComponentButton from './ComponentButton'
import CheckboxEditor from './question_editor/CheckboxEditor'
import * as Utils from '../../utils'

export default class ComponentList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { } = this.props;
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

ComponentList.defaultProps = {
};

ComponentList.propTypes = {
};
