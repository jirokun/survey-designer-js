/* eslint-env browser */
import React from 'react';
import { connect } from 'react-redux';
import S from 'string';
import $ from 'jquery';
import classNames from 'classnames';
import { parseInteger } from '../../../utils';
import TransformQuestion from './TransformQuestion';
import MultiNumberQuestionState from '../../states/MultiNumberQuestionState';
import ItemDefinition from '../../models/survey/questions/internal/ItemDefinition';
import BaseQuestionDefinition from '../../models/survey/questions/internal/BaseQuestionDefinition';
import QuestionDetail from '../parts/QuestionDetail';

/** 設問：数値記入 */
class MultiNumberQuestion extends TransformQuestion {
  constructor(props) {
    super(props, MultiNumberQuestionState);
  }

  /** Reactのライフサイクルメソッド */
  componentDidMount() {
    this.rootEl.addEventListener('change', () => this.setTotalValue(), false);
    this.rootEl.addEventListener('keyup', () => this.setTotalValue(), false);
  }

  /** 入力値をもとに合計値を設定する */
  setTotalValue() {
    const { question } = this.props;
    const idList = this.state.model.getTransformedItems().map(item => question.getOutputName(false, item.getIndex())).toList();
    const doc = this.rootEl.ownerDocument;
    // sdj-numericが全角を半角にした後に計算する必要があるため、setTimeoutしてnextTickで処理を行う
    setTimeout(() => {
      const total = idList.reduce((reduction, id) => {
        const $targetEl = $(this.rootEl).find(`#${id}:visible`);
        return reduction + parseInteger($targetEl.val(), 0);
      }, 0);

      const totalId = question.getOutputName(true);
      const totalEl = doc.getElementById(totalId);
      if (!totalEl) return;
      totalEl.value = total;
    }, 1);
  }

  /** 制御情報を作成する */
  createItemDetail(item) {
    const { options, question } = this.props;
    if (!options.isShowDetail()) return null;

    if (!question.isRandom() || !item.isRandomFixed()) return null;
    return (
      <span className="detail-function" style={{ verticalAlign: 'top' }}>ランダム固定</span>
    );
  }

  /** additionalInputを描画する */
  createAdditionalInput(item, question, errorContainerId) {
    if (!item.hasAdditionalInput()) return null;
    const { survey, replacer } = this.props;
    const type = item.getAdditionalInputType();
    const name = question.getOutputName(item.getIndex(), true);
    const unit = item.getUnit();

    return (
      <span>
        <input
          type="text"
          pattern={type === 'number' ? '\\d*' : null}
          maxLength={type === 'number' ? 16 : 100}
          name={name}
          data-parsley-errors-container={`#${errorContainerId}`}
          data-output-no={survey.findOutputNoFromName(name)}
          data-parsley-required
          data-parsley-positive-integer={type === 'number' ? true : null}
          className={classNames('additionalInput', { number: type === 'number' })}
          onClick={e => e.preventDefault()}
        />
        <span dangerouslySetInnerHTML={{ __html: replacer.id2Span(unit) }} />
      </span>
    );
  }

  /** itemに対応するelementを作成する */
  createItem(item, isTotal = false) {
    const { survey, runtime, options, replacer, question } = this.props;
    const name = question.getOutputName(isTotal, item.getIndex());
    const errorContainerId = `${name}_error_container`;

    const className = classNames('multiNumberLine', {
      multiNumberTotal: isTotal,
      [item.calcVisibilityClassName(survey, runtime.getAnswers())]: !options.isVisibilityConditionDisabled(),
    });

    return (
      <div key={`${question.getId()}_${item.getIndex()}`} className={className} data-row-order={isTotal ? 'total' : item.getIndex() + 1}>
        <div className="multiNumberLabel">
          <label dangerouslySetInnerHTML={{ __html: replacer.id2Span(item.getLabel()) }} />
          {this.createAdditionalInput(item, question, errorContainerId)}
        </div>
        <div className="multiNumberAssociated mini">
          <div className="multiNumberInput">
            <input
              type="text"
              pattern="\d*"
              maxLength="16"
              id={name}
              name={name}
              className={classNames('sdj-numeric', { disabled: isTotal })}
              readOnly={isTotal}
              data-output-no={survey.findOutputNoFromName(name)}
              data-response-multiple
              data-response-item-index={isTotal ? null : item.getIndex()}
              data-parsley-required={!isTotal}
              data-parsley-positive-integer
              data-parsley-errors-container={`#${errorContainerId}`}
            />
            <span className="multiNumberUnit"> {question.getUnit()}</span>
            <span id={errorContainerId} />
          </div>
        </div>
        {this.createItemDetail(item)}
      </div>
    );
  }

  /** itemsに対応するelementを作成する */
  createItems() {
    const { model } = this.state;
    const items = model.getTransformedItems();
    if (items.size === 0) {
      throw new Error('items attribute is not defined');
    }
    return items.map(item => this.createItem(item));
  }

  /** 合計のelementを作成する */
  createTotalItem() {
    const { question } = this.props;
    if (!question.isShowTotal()) {
      return null;
    }
    return this.createItem(new ItemDefinition({ devId: `${question.getDevId()}_total`, label: '合計' }), true);
  }

  render() {
    const { replacer, question, options } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const answers = {};
    return (
      <div ref={(el) => { this.rootEl = el || this.rootEl; }} className="MultiNumberQuestion">
        <h2 className="question-title" data-dev-id-label={question.getDevId()} dangerouslySetInnerHTML={{ __html: replacer.id2Span(title, answers) }} />
        <h3 className="question-description" dangerouslySetInnerHTML={{ __html: replacer.id2Span(description, answers) }} />
        <div className="question validation-hover-target">
          {this.createItems()}
          {this.createTotalItem()}
        </div>
        { options.isShowDetail() ? <QuestionDetail question={question} random /> : null }
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
  options: state.getOptions(),
});

export default connect(
  stateToProps,
)(MultiNumberQuestion);
