import React from 'react';
import S from 'string';
import TransformQuestion from './TransformQuestion';
import MultiNumberQuestionState from '../../states/MultiNumberQuestionState';

/** CheckboxQuestion, RadioQuestionの基底クラス */
export default class MatrixQuestion extends TransformQuestion {
  static createRow(question, item, itemIndex, replaceUtil) {
    const subItems = question.getSubItems();
    return (
      <tr key={`${question.getId()}_${item.getId()}`}>
        <td dangerouslySetInnerHTML={{ __html: replaceUtil.name2Value(item.getLabel()) }} />
        {subItems.map((subItem) => {
          const matrixType = question.getMatrixType();
          const name = question.getOutputName(item, subItem);
          const value = question.getOutputValue(subItem);
          return <td key={`${question.getId()}_${item.getId()}_${subItem.getId()}`}><label><input type={matrixType} name={name} value={value} /></label></td>;
        })}
      </tr>
    );
  }

  constructor(props) {
    super(props, MultiNumberQuestionState);
  }

  /** 描画 */
  render() {
    const { replaceUtil, question } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        {S(title).isEmpty() ? null : <h2 className="question-title" dangerouslySetInnerHTML={{ __html: replaceUtil.name2Value(title) }} />}
        {S(description).isEmpty() ?
          null : <h3 className="question-description" dangerouslySetInnerHTML={{ __html: replaceUtil.name2Value(description) }} />}
        <div className="question">
          <table className="matrix group question-form-grid-table" id="Qf8e62579-435a-4b67-b731-e2ccd3c6dc36_table">
            <thead>
              <tr>
                <td />
                {question.getTransformedSubItems().map(subItem =>
                  <td key={subItem.getId()} dangerouslySetInnerHTML={{ __html: replaceUtil.name2Value(subItem.getLabel()) }} />)}
              </tr>
            </thead>
            <tbody>
              {question.getTransformedItems().map((item, itemIndex) => MatrixQuestion.createRow(question, item, itemIndex, replaceUtil))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
