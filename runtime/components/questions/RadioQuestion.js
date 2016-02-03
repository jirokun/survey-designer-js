import React, { Component, PropTypes } from 'react'

export default class RadioQuestion extends Component {
  render() {
    const { questionTitle, questionName } = this.props;
    return (
      <div>
        <h3>{questionTitle}</h3>
        <label>
          <input type="radio" name={questionName}/>
          選択肢1
        </label>
        <label>
          <input type="radio" name={questionName}/>
          選択肢2
        </label>
        <label>
          <input type="radio" name={questionName}/>
          選択肢3
        </label>
        <label>
          <input type="radio" name={questionName}/>
          選択肢4
        </label>
        <label>
          <input type="radio" name={questionName}/>
          選択肢5
        </label>
      </div>
    );
  }
}
