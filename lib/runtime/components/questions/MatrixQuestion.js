import React from 'react';
import S from 'string';
import classNames from 'classnames';
import TransformQuestion from './TransformQuestion';
import MultiNumberQuestionState from '../../states/MultiNumberQuestionState';

/** CheckboxQuestion, RadioQuestionの基底クラス */
export default class MatrixQuestion extends TransformQuestion {
  /** 追加の入力elementを作成する */
  static createAdditionalInputElement(question, item, subItem) {
    const matrixType = question.getMatrixType();
    if (matrixType !== 'checkbox' && matrixType !== 'radio') return null;

    const targetItem = question.isMatrixReverse() ? item : subItem;
    if (!targetItem.hasAdditionalInput()) return null;

    const name = question.isMatrixReverse() ? question.getAdditionalOutputName(subItem, item) : question.getAdditionalOutputName(item, subItem);
    return (
      <span>
        <input type={targetItem.getAdditionalInputType()} name={name} disabled className="disabled additional-input" />
        {targetItem.getUnit()}
      </span>
    );
  }

  /** inputを作成する */
  static createInputElement(tableId, rowId, question, item, subItem) {
    const matrixType = question.getMatrixType();
    const name = question.isMatrixReverse() ? question.getOutputName(subItem, item) : question.getOutputName(item, subItem);
    const value = question.isMatrixReverse() ? question.getOutputValue(item) : question.getOutputValue(subItem);
    switch (matrixType) {
      case 'radio':
        return (
          <input
            type={matrixType}
            name={name}
            value={value}
            className="matrix-value"
            data-parsley-class-handler={`#${tableId}`}
            data-parsley-required
            data-parsley-required-message="すべての行について選択してください"
          />
        );
      case 'text':
        return (
          <input
            type={matrixType}
            name={name}
            data-parsley-required
          />
        );
      case 'number':
        return (
          <input
            type={matrixType}
            name={name}
            className="sdj-numeric"
            data-parsley-required
          />
        );
      case 'checkbox':
        return (
          <input
            type={matrixType}
            name={name}
            value={value}
            className="matrix-value"
            data-parsley-class-handler={`#${rowId}`}
            data-parsley-required
            data-parsley-multiple={item.getId()}
            data-parsley-required-message="最低一つ選択してください"
          />
        );
      default:
        throw new Error(`不明なmatrixTypeです: ${matrixType}`);
    }
  }

  static createRow(tableId, question, item, itemIndex, subItems, replacer) {
    const rowId = `${question.getId()}_${item.getId()}`;
    const totalName = question.getOutputTotalRowName(item);
    let sumEl = null;
    if (question.isMatrixSumRows()) {
      const totalEqualTo = item.getTotalEqualTo();
      sumEl = (
        <td>
          <input
            name={totalName}
            className="sdj-sum disabled"
            type="text"
            size="4"
            readOnly
            defaultValue="0"
            data-parsley-required
            data-parsley-type="digits"
            data-parsley-equal={!S(totalEqualTo).isEmpty() ? replacer.id2Value(totalEqualTo) : null}
          />
        </td>
      );
    }
    return (
      <tr key={rowId} id={rowId}>
        <td dangerouslySetInnerHTML={{ __html: replacer.id2Value(item.getLabel()) }} />
        {subItems.map(subItem => (
          <td key={`${question.getId()}_${item.getId()}_${subItem.getId()}`}>
            <label>
              {MatrixQuestion.createInputElement(tableId, rowId, question, item, subItem)}
              {MatrixQuestion.createAdditionalInputElement(question, item, subItem)}
            </label>
          </td>))
        }
        {sumEl}
      </tr>
    );
  }

  /** 列の合計行を作成する */
  static createSumColRow(question, items, replacer) {
    if (question.getMatrixType() === 'number' && question.isMatrixSumCols()) {
      return (
        <tr>
          <td>合計</td>
          {
            items.map((item) => {
              const totalName = question.getOutputTotalColName(item);
              const colId = `${question.getId()}_${item.getId()}_sum`;
              const totalEqualTo = item.getTotalEqualTo();
              return (
                <td key={colId}>
                  <input
                    name={totalName}
                    className="sdj-sum disabled"
                    type="text"
                    size="4"
                    readOnly
                    defaultValue="0"
                    data-parsley-required
                    data-parsley-type="digits"
                    data-parsley-equal={!S(totalEqualTo).isEmpty() ? replacer.id2Value(totalEqualTo) : null}
                  />
                </td>
              );
            })
          }
        </tr>
      );
    }
    return null;
  }

  constructor(props) {
    super(props, MultiNumberQuestionState);
  }

  /** 描画 */
  render() {
    const { replacer, question } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const tableId = `${question.getId()}_table`;
    const items = question.getTransformedItems();
    const subItems = question.getTransformedSubItems();
    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        {S(title).isEmpty() ? null : <h2 className="question-title" dangerouslySetInnerHTML={{ __html: replacer.id2Value(title) }} />}
        {S(description).isEmpty() ?
          null : <h3 className="question-description" dangerouslySetInnerHTML={{ __html: replacer.id2Value(description) }} />}
        <div className="question">
          <table
            className={
              classNames('matrix group question-form-grid-table sdj-matrix',
                {
                  'sdj-sum-columns': question.isMatrixSumCols(),
                  'sdj-sum-rows': question.isMatrixSumRows(),
                },
              )
            }
            id={tableId}
          >
            <thead>
              <tr>
                <td />
                {subItems.map(subItem => <td key={subItem.getId()} dangerouslySetInnerHTML={{ __html: replacer.id2Value(subItem.getLabel()) }} />)}
                {question.getMatrixType() === 'number' && question.isMatrixSumRows() ? <td>合計</td> : null}
              </tr>
            </thead>
            <tbody>
              {items.map((item, itemIndex) => MatrixQuestion.createRow(tableId, question, item, itemIndex, subItems, replacer))}
              {MatrixQuestion.createSumColRow(question, subItems, replacer)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
