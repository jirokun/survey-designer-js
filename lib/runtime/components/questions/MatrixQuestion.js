/* eslint-env browser */
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import S from 'string';
import $ from 'jquery';
import classNames from 'classnames';
import QuestionDetail from '../parts/QuestionDetail';
import { isSP, convertVerticalWriting } from '../../../utils';
import * as CommonQuestionParts from '../parts/CommonQuestionParts';

/** CheckboxQuestion, RadioQuestionの基底クラス */
export default class MatrixQuestion extends Component {
  /** 数値合計の単位elementを作成する */
  static createUnitLabelElementForSumNumber(question, item) {
    if (question.getMatrixType() !== 'number') return null;

    return (
      <span className="numberUnitLabel">
        {item.getUnit()}
      </span>
    );
  }

  static executeReplacer(str, replacer, useId2No) {
    return useId2No ? replacer.id2No(str) : replacer.id2Span(str);
  }

  /** 追加の入力elementを作成する */
  static createAdditionalInputElement(type, question, item) {
    if (!item.hasAdditionalInput()) return null;

    const outputDefinition = question.getOutputDefinitionForAdditionalInputFromItem(type, item);
    const name = outputDefinition.getName();
    const errorsContainerId = `${name}_errors_container`;
    const inputType = item.getAdditionalInputType();
    return (
      <span>
        <input
          type="text"
          pattern={inputType === 'number' ? '\\d*' : null}
          maxLength={inputType === 'number' ? 16 : 100}
          name={name}
          className={classNames('additional-input', { number: inputType === 'number' })}
          data-parsley-errors-container={`#${errorsContainerId}`}
          data-parsley-positive-integer={inputType === 'number' ? true : null}
        />
        <span id={errorsContainerId} />
      </span>
    );
  }

  static createRow(survey, question, options, item, itemIndex, subItems, useId2No) {
    const replacer = survey.getReplacer();
    const rowId = item.getId();
    const totalName = question.getOutputTotalRowName(item);
    let sumEl = null;

    // 行の合計値表示
    if (question.getMatrixType() === 'number' && question.isMatrixSumRows()) {
      sumEl = (
        <td>
          <label>
            <input
              name={totalName}
              className="sdj-sum disabled"
              type="text"
              readOnly
              size="4"
              defaultValue="0"
              data-output-no={survey.findOutputNoFromName(totalName)}
              data-parsley-required
              data-parsley-positive-integer
            />
            {MatrixQuestion.createUnitLabelElementForSumNumber(question, item)}
          </label>
        </td>
      );
    }
    return (
      <tr key={rowId} id={rowId} data-row-order={item.getIndex() + 1}>
        <td className={classNames({ 'detail-shown': question.isRandom() && item.isRandomFixed() })}>
          <span id={question.getLabelId(item)} dangerouslySetInnerHTML={{ __html: MatrixQuestion.executeReplacer(item.getLabel(), replacer, useId2No) }} />
          {MatrixQuestion.createAdditionalInputElement('row', question, item)}
        </td>
        {subItems.map((subItem) => {
          return (
            <td key={`${question.getId()}_${item.getId()}_${subItem.getId()}`} data-item-id={item.getId()} data-subitem-id={subItem.getId()}>
              <label>
                {MatrixQuestion.createInputElement(survey, rowId, question, item, subItem)}
                {MatrixQuestion.createUnitLabelElementForNumber(question, item, subItem)}
              </label>
            </td>
          );
        })}
        {sumEl}
      </tr>
    );
  }

  static getTableId(question) {
    return `${question.getId()}_table`;
  }

  static createQuestionElement(survey, question, options, useId2No) {
    const replacer = survey.getReplacer();
    const matrixHtml = question.getMatrixHtml();
    const items = question.getItems();
    const subItems = question.getSubItems();

    if (matrixHtml !== null) return <div className="question" dangerouslySetInnerHTML={{ __html: MatrixQuestion.executeReplacer(matrixHtml, replacer, useId2No) }} />;

    return (
      <div className="question">
        <table
          className="matrix group question-form-grid-table"
          id={MatrixQuestion.getTableId(question)}
        >
          <thead>
            <tr>
              <td />
              {subItems.map((subItem) => {
                const columnClassName = classNames({
                  'detail-shown': question.isSubItemsRandom() && subItem.isRandomFixed(),
                  'col-vertical-writing': question.isMatrixColVerticalWriting(),
                });
                const innerColumnClassName = classNames({
                  'vertical-writing': question.isMatrixColVerticalWriting(),
                });
                return (
                  <td key={subItem.getId()} id={subItem.getId()} className={columnClassName} data-col-order={subItem.getIndex() + 1}>
                    { /* AndroidやiOSにおける縦書き時のはみ出し対応のため親divタグを定義している。*/ }
                    <div><div id={question.getLabelId(subItem)} className={innerColumnClassName} dangerouslySetInnerHTML={{ __html: MatrixQuestion.executeReplacer(convertVerticalWriting(innerColumnClassName, subItem.getLabel()), replacer, useId2No) }} /></div>
                    {MatrixQuestion.createAdditionalInputElement('column', question, subItem)}
                  </td>
                );
              })}
              {question.getMatrixType() === 'number' && question.isMatrixSumRows() ? <td data-col-order="total">合計</td> : null}
            </tr>
          </thead>
          <tbody>
            {items.map((item, itemIndex) => MatrixQuestion.createRow(survey, question, options, item, itemIndex, subItems, useId2No))}
            {MatrixQuestion.createSumColRow(survey, question, subItems)}
          </tbody>
        </table>
      </div>
    );
  }

  static getOutputName(question, item, subItem) {
    if (question.isMatrixReverse()) {
      return question.getOutputName(subItem, item);
    }
    return question.getOutputName(item, subItem);
  }


  /** 数値の単位elementを作成する */
  static createUnitLabelElementForNumber(question, item, subItem) {
    if (question.getMatrixType() !== 'number') return null;

    const targetItem = question.isMatrixReverse() ? item : subItem;
    return (
      <span className="numberUnitLabel">
        {targetItem.getUnit()}
      </span>
    );
  }

  /** inputを作成する */
  static createInputElement(survey, rowId, question, item, subItem) {
    const matrixType = question.getMatrixType();
    const name = MatrixQuestion.getOutputName(question, item, subItem);
    const value = question.isMatrixReverse() ? question.getOutputValue(item) : question.getOutputValue(subItem);
    switch (matrixType) {
      case 'radio': {
        const classHandlerId = question.isMatrixReverse() ? subItem.getId() : rowId;
        const errorsContainerId = question.getLabelId(question.isMatrixReverse() ? subItem : item);
        let errorMessage;
        if (isSP()) errorMessage = '必須';
        else errorMessage = `この${question.isMatrixReverse() ? '列' : '行'}の選択値を選択してください`;
        return (
          <input
            key={`${item.getId()}_${subItem.getId()}_radio`}
            type={matrixType}
            name={name}
            value={value}
            className="matrix-value not-converted"
            data-output-no={survey.findOutputNoFromName(name)}
            data-parsley-class-handler={`#${classHandlerId}`}
            data-parsley-errors-container={`#${errorsContainerId}`}
            data-parsley-required
            data-parsley-required-message={errorMessage}
          />
        );
      }
      case 'text': {
        return (
          <input
            key={`${item.getId()}_${subItem.getId()}_text`}
            type={matrixType}
            name={name}
            data-output-no={survey.findOutputNoFromName(name)}
            data-parsley-required
          />
        );
      }
      case 'number': {
        return (
          <input
            key={`${item.getId()}_${subItem.getId()}_number`}
            type="text"
            pattern="\d*"
            maxLength="16"
            name={name}
            className="sdj-numeric"
            size="4"
            data-output-no={survey.findOutputNoFromName(name)}
            data-parsley-required
            data-parsley-positive-integer
          />
        );
      }
      case 'checkbox': {
        const exclusive = question.isMatrixReverse() ? item.isExclusive() : subItem.isExclusive();
        const classHandlerId = question.isMatrixReverse() ? subItem.getId() : rowId;

        const groupItem = question.isMatrixReverse() ? subItem : item;
        const multipleId = groupItem.getId();
        const errorsContainerId = question.getLabelId(groupItem);
        return (
          <input
            key={`${item.getId()}_${subItem.getId()}_checkbox`}
            type={matrixType}
            name={name}
            value={value}
            className={classNames('matrix-value not-converted', { exclusive })}
            data-output-no={survey.findOutputNoFromName(name)}
            data-parsley-class-handler={`#${classHandlerId}`}
            data-parsley-errors-container={`#${errorsContainerId}`}
            data-parsley-required={groupItem.getMinCheckCount() > 0}
            data-parsley-multiple={multipleId}
            data-parsley-mincheck={groupItem.getMinCheckCount() !== 0 ? groupItem.getMinCheckCount() : null}
            data-parsley-maxcheck={groupItem.getMaxCheckCount() !== 0 ? groupItem.getMaxCheckCount() : null}
            data-parsley-required-message="選択してください"
            data-parsley-maxcheck-message="%s 個以下で選択してください"
          />
        );
      }
      default:
        throw new Error(`不明なmatrixTypeです: ${matrixType}`);
    }
  }

  /** 列の合計値エリアを構築する */
  static createSumColRow(survey, question, items) {
    if (question.getMatrixType() === 'number' && question.isMatrixSumCols()) {
      return (
        <tr data-row-order="total">
          <td>合計</td>
          {
            items.map((item) => {
              const totalName = question.getOutputTotalColName(item);
              const colId = `${question.getId()}_${item.getId()}_sum`;
              return (
                <td key={colId}>
                  <label>
                    <input
                      name={totalName}
                      className="sdj-sum disabled"
                      type="text"
                      readOnly
                      size="4"
                      defaultValue="0"
                      data-output-no={survey.findOutputNoFromName(totalName)}
                      data-parsley-required
                      data-parsley-positive-integer
                    />
                    {MatrixQuestion.createUnitLabelElementForSumNumber(question, item)}
                  </label>
                </td>
              );
            })
          }
        </tr>
      );
    }
    return null;
  }

  /** Reactのライフサイクルメソッド */
  componentDidMount() {
    // 縦書きをすると文字の長さによってはみ出してしまうブラウザがいるので、それに対する救済措置
    // firefoxやSafariではtdタグの直下のdivタグが縦書きになっていると、幅を正しく制御できない。
    // そのため、JavaScriptで明示的に要素の幅を指定することでバグを回避する。
    // なお、Chromeではこの減少は発生しない。
    // 縦書きのヘッダー項目を取得する
    const rootEl = ReactDOM.findDOMNode(this);
    const verticalElements = $(rootEl).find('.vertical-writing');
    let isExpand = false;
    verticalElements.each((i, el) => {
      const $el = $(el);
      const $td = $(el).closest('td');
      const verticalElementWidth = $el.width();
      // 親TD幅 < 縦書き定義div幅だったら、親のdiv幅に縦書き定義div幅を設定する
      if ($td.width() < verticalElementWidth) {
        isExpand = true;
        return false;
      }
    });
    // 幅調整する
    if (isExpand) {
      verticalElements.each((i, el) => {
        const $el = $(el);
        const $div = $(el).parent('div');
        const verticalElementWidth = $el.width();
        $div.css('width', `${verticalElementWidth}px`).css('display', 'inline-block');
      });
    }
  }

  /** 描画 */
  render() {
    const { survey, question, options, showOnlyTable, useId2No } = this.props;
    const replacer = survey.getReplacer();

    return (
      <div key={`Matrix-${question.getMatrixType()}-${question.getId()}`} className="MatrixQuestion">
        { showOnlyTable ? null : CommonQuestionParts.title(question, replacer) }
        { showOnlyTable ? null : CommonQuestionParts.description(question, replacer) }
        { MatrixQuestion.createQuestionElement(survey, question, options, useId2No) }
        { !showOnlyTable && options.isShowDetail() ? (
          <QuestionDetail
            {...this.props}
            random
            subItemsRandom
            matrixReverse
            matrixHtml
          />) : null }
      </div>
    );
  }
}
