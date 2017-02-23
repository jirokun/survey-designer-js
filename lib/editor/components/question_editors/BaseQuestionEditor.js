import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, FormGroup, ControlLabel, Checkbox, FormControl, InputGroup } from 'react-bootstrap';
import ItemEditor from './ItemEditor';
import QuestionHtmlEditor from './QuestionHtmlEditor';
import * as EditorActions from '../../actions';

/**
 * 各QuestionEditorのベースとなるクラス
 * それぞれのQuestionEditorはこのクラスを継承し、
 * プロパティを渡すことで各項目のエディタのon, offを切り替える。
 *
 * 例えば下記のようにすればdescription(補足)を編集できるエディタを作成できる
 *      <BaseQuestionEditor
 *        page={page}
 *        question={question}
 *        description
 *      />
 *
 * また各プロパティがtrueであれば編集項目名のタイトルはデフォルト表示される。
 * trueではなくstringが渡された場合は編集項目名を上書きすることができる。
 * 下記の例ではdescriptionの項目名が説明と画面上に表示される。
 *      <BaseQuestionEditor
 *        page={page}
 *        question={question}
 *        description
 *      />
 */
class BaseQuestionEditor extends Component {
  /** questionの属性が変更されたときのハンドラ */
  handleChangeQuestionAttribute(attribute, value) {
    const { page, question, changeQuestionAttribute } = this.props;
    changeQuestionAttribute(page.getId(), question.getId(), attribute, value);
  }

  /** 各項目のエディタを描画する */
  renderEachEditor() {
    const {
      state,
      page,
      question,
      title,
      description,
      random,
      item,
      showTotal,
      unit,
      itemExclusive,
      itemAdditionalInput,
      itemPlainText,
      noEdit,
    } = this.props;

    const questionNo = state.calcQuestionNo(page.getId(), question.getId());

    // noEditが指定された場合は編集不可能である旨を表示する
    if (noEdit) {
      return (
        <div>
          <h4>{questionNo} 項目定義</h4>
          <FormGroup>
            <Col md={12}>編集不可</Col>
          </FormGroup>
        </div>
      );
    }

    const items = question.getItems();
    return (
      <div>
        <h4>{questionNo} 項目定義</h4>
        { title ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>{title === true ? '質問タイトル' : title}</Col>
            <Col md={10}><QuestionHtmlEditor page={page} question={question} attributeName="title" /></Col>
          </FormGroup> : null }
        { description ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>{description === true ? '補足' : description}</Col>
            <Col md={10}><QuestionHtmlEditor page={page} question={question} attributeName="description" /></Col>
          </FormGroup> : null }
        { random || showTotal ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>オプション</Col>
            <Col md={10}>
              { random ?
                <Checkbox checked={question.isRandom()} onChange={e => this.handleChangeQuestionAttribute('random', e.target.checked)}>選択肢の表示順をランダム表示</Checkbox> : null }
              { showTotal ?
                <Checkbox checked={question.isShowTotal()} onChange={e => this.handleChangeQuestionAttribute('showTotal', e.target.checked)}>入力値の合計を表示する</Checkbox> : null }
            </Col>
          </FormGroup> : null }
        { item ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>{item === true ? '選択肢' : item}</Col>
            <Col md={10}>
              <div className="item-editor">
                <table className="item-editor-table">
                  <thead>
                    <tr>
                      <th />
                      <th />
                      { itemAdditionalInput && items.find(i => i.hasAdditionalInput()) ? <th>入力<br />タイプ</th> : <th />}
                      { itemAdditionalInput && items.find(i => i.hasAdditionalInput()) ? <th>単位</th> : <th /> }
                      { itemAdditionalInput ? <th>追加<br />入力</th> : <th /> }
                      {question.isRandom() ? <th>固定</th> : null}
                      {itemExclusive ? <th>排他</th> : null}
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((questionItem, index) =>
                      <ItemEditor
                        key={`${this.constructor.name}_ItemEditor_${questionItem.getId()}`}
                        page={page}
                        question={question}
                        item={questionItem}
                        plainText={itemPlainText}
                        index={index}
                        exclusive={itemExclusive}
                        additionalInput={itemAdditionalInput}
                      />,
                    )}
                  </tbody>
                </table>
              </div>
            </Col>
          </FormGroup> : null }
        { unit ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>{unit === true ? '単位' : unit}</Col>
            <Col md={10}>
              <FormControl componentClass="input" value={question.getUnit()} onChange={e => this.handleChangeQuestionAttribute('unit', e.target.value)} />
            </Col>
          </FormGroup> : null }
      </div>
    );
  }

  /** 各項目のバリデーションのエディタを描画する */
  renderValidationEditor() {
    const {
      state,
      page,
      question,
      min,
      max,
      checkCount,
      totalEqualTo,
    } = this.props;

    // 一つも編集可能となっていない場合は描画しない
    if (!(min || max || totalEqualTo || checkCount)) {
      return null;
    }

    const questionNo = state.calcQuestionNo(page.getId(), question.getId());

    return (
      <form ref={(el) => { this.formEl = el; }}>
        <h4>{questionNo} 入力値制限</h4>
        { min ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>最小値</Col>
            <Col md={10}>
              <FormControl componentClass="input" value={question.getMin()} onChange={e => this.handleChangeQuestionAttribute('min', e.target.value)} />
            </Col>
          </FormGroup> : null }
        { max ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>最大値</Col>
            <Col md={10}>
              <FormControl componentClass="input" value={question.getMax()} onChange={e => this.handleChangeQuestionAttribute('max', e.target.value)} />
            </Col>
          </FormGroup> : null }
        { totalEqualTo && question.isShowTotal() ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>合計値</Col>
            <Col md={10}>
              <FormGroup>
                <InputGroup>
                  <FormControl type="text" value={question.getTotalEqualTo()} onChange={e => this.handleChangeQuestionAttribute('totalEqualTo', e.target.value)} />
                  <InputGroup.Addon>になるように制限する</InputGroup.Addon>
                </InputGroup>
              </FormGroup>
            </Col>
          </FormGroup> : null }
        { checkCount ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>チェック数制限</Col>
            <Col md={10}>
              <div className="form-inline">
                <label htmlFor="dummy">最小</label>
                <FormControl componentClass="select" value={question.getMinCheckCount()} onChange={e => this.handleChangeQuestionAttribute('minCheckCount', e.target.value)}>
                  {question.getItems().map((c, i) => {
                    const key = `${page.getId()}-${question.getId()}-minCheckCount-${i}`;
                    return <option key={key} value={i}>{i === 0 ? '制限なし' : i}</option>;
                  })}
                  <option value={question.getItems().size}>{question.getItems().size}</option>;
                </FormControl>
                <label htmlFor="dummy">最大</label>
                <FormControl componentClass="select" value={question.getMaxCheckCount()} onChange={e => this.handleChangeQuestionAttribute('maxCheckCount', e.target.value)}>
                  {question.getItems().map((c, i) => {
                    const key = `${page.getId()}-${question.getId()}-maxCheckCount-${i}`;
                    return <option key={key} value={i}>{i === 0 ? '制限なし' : i}</option>;
                  })}
                  <option value={question.getItems().size}>{question.getItems().size}</option>;
                </FormControl>
              </div>
            </Col>
          </FormGroup> : null }
      </form>
    );
  }

  /** 描画 */
  render() {
    return (
      <div>
        {this.renderEachEditor()}
        {this.renderValidationEditor()}
      </div>
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  changeQuestionAttribute: (pageId, questionId, attribute, value) =>
    dispatch(EditorActions.changeQuestionAttribute(pageId, questionId, attribute, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(BaseQuestionEditor);
