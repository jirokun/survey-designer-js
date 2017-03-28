import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, FormGroup, ControlLabel, Checkbox, FormControl, InputGroup } from 'react-bootstrap';
import SubItemEditor from './SubItemEditor';
import ItemEditorPart from './parts/ItemEditorPart';
import QuestionHtmlEditorPart from './parts/QuestionHtmlEditorPart';
import ValueEditorPart from './parts/ValueEditorPart';
import ItemValidationEditorPart from './parts/ItemValidationEditorPart';
import * as EditorActions from '../../actions';
import BaseQuestionDefinition from '../../../runtime/models/survey/questions/internal/BaseQuestionDefinition';

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
  createEachEditor() {
    const {
      survey,
      page,
      editorTitle,
      question,
      title,
      description,
      matrixType,
      matrixReverse,
      matrixSumRows,
      matrixSumCols,
      random,
      subItemsRandom,
      item,
      subItem,
      showTotal,
      unit,
      itemExclusive,
      subItemExclusive,
      itemAdditionalInput,
      subItemAdditionalInput,
      itemPlainText,
      noEdit,
    } = this.props;

    const questionNo = BaseQuestionDefinition.createOutputNo(
      survey.calcPageNo(page.getId()),
      survey.calcQuestionNo(page.getId(), question.getId()),
    );

    // noEditが指定された場合は編集不可能である旨を表示する
    if (noEdit) {
      return (
        <div>
          <h4>{questionNo} {editorTitle}</h4>
          <FormGroup>
            <Col md={12}>編集不可</Col>
          </FormGroup>
        </div>
      );
    }

    const items = question.getItems();
    const subItems = question.getSubItems();
    return (
      <div>
        <h4 className="enq-title enq-title__page">{questionNo} {editorTitle}</h4>
        { title ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>{title === true ? '質問タイトル' : title}</Col>
            <Col md={10}>
              <QuestionHtmlEditorPart
                page={page}
                question={question}
                attributeName="title"
                toolbar="italic underline strikethrough forecolor backcolor removeformat table link unlink fullscreen"
              />
            </Col>
          </FormGroup> : null }
        { description ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>{description === true ? '補足' : description}</Col>
            <Col md={10}><QuestionHtmlEditorPart page={page} question={question} attributeName="description" /></Col>
          </FormGroup> : null }
        { matrixType ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>{matrixType === true ? '設問タイプ' : matrixType}</Col>
            <Col md={10}>
              <FormControl componentClass="select" value={question.getMatrixType()} onChange={e => this.handleChangeQuestionAttribute('matrixType', e.target.value)}>
                <option value="checkbox">チェックボックス</option>
                <option value="radio">ラジオ</option>
                <option value="text">テキスト</option>
                <option value="number">数値</option>
              </FormControl>
            </Col>
          </FormGroup> : null }
        { random || showTotal ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>オプション</Col>
            <Col md={10}>
              { random ?
                <Checkbox checked={question.isRandom()} onChange={e => this.handleChangeQuestionAttribute('random', e.target.checked)}>{random === true ? '選択肢の表示順をランダム表示' : random}</Checkbox> : null }
              { subItemsRandom ?
                <Checkbox checked={question.isSubItemsRandom()} onChange={e => this.handleChangeQuestionAttribute('subItemsRandom', e.target.checked)}>{subItemsRandom === true ? '列項目をランダム表示' : subItemsRandom}</Checkbox> : null }
              { showTotal ?
                <Checkbox checked={question.isShowTotal()} onChange={e => this.handleChangeQuestionAttribute('showTotal', e.target.checked)}>{showTotal === true ? '入力値の合計を表示する' : showTotal}</Checkbox> : null }
              { matrixReverse ?
                <Checkbox checked={question.isMatrixReverse()} onChange={e => this.handleChangeQuestionAttribute('matrixReverse', e.target.checked)}>{matrixReverse === true ? '列でグルーピング' : matrixReverse}</Checkbox> : null }
              { matrixSumRows ?
                <Checkbox checked={question.isMatrixSumRows()} onChange={e => this.handleChangeQuestionAttribute('matrixSumRows', e.target.checked)}>{matrixSumRows === true ? '行の合計値を表示' : matrixSumRows}</Checkbox> : null }
              { matrixSumCols ?
                <Checkbox checked={question.isMatrixSumCols()} onChange={e => this.handleChangeQuestionAttribute('matrixSumCols', e.target.checked)}>{matrixSumCols === true ? '列の合計値を表示' : matrixSumCols}</Checkbox> : null }
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
                      {itemAdditionalInput && items.find(i => i.hasAdditionalInput()) ? <th>入力<br />タイプ</th> : <th />}
                      {itemAdditionalInput && items.find(i => i.hasAdditionalInput()) ? <th>単位</th> : <th />}
                      {itemAdditionalInput ? <th>追加<br />入力</th> : <th /> }
                      {question.isRandom() ? <th>固定</th> : null}
                      {itemExclusive ? <th>排他</th> : null}
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((questionItem, index) =>
                      <ItemEditorPart
                        key={`${this.constructor.name}_ItemEditorParts_${questionItem.getId()}`}
                        page={page}
                        question={question}
                        item={questionItem}
                        plainText={itemPlainText}
                        index={index}
                        exclusive={itemExclusive}
                        additionalInput={itemAdditionalInput}
                        subItem={false}
                      />,
                    )}
                  </tbody>
                </table>
              </div>
            </Col>
          </FormGroup> : null }
        { subItem ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>{subItem === true ? '選択肢' : subItem}</Col>
            <Col md={10}>
              <div className="item-editor">
                <table className="item-editor-table">
                  <thead>
                    <tr>
                      <th />
                      <th />
                      {subItemAdditionalInput && items.find(i => i.hasAdditionalInput()) ? <th>入力<br />タイプ</th> : <th />}
                      {subItemAdditionalInput && items.find(i => i.hasAdditionalInput()) ? <th>単位</th> : <th />}
                      {subItemAdditionalInput ? <th>追加<br />入力</th> : <th /> }
                      {question.isSubItemsRandom() ? <th>固定</th> : null}
                      {subItemExclusive ? <th>排他</th> : null}
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {subItems.map((questionSubItem, index) =>
                      <SubItemEditor
                        key={`${this.constructor.name}_ItemEditor_${questionSubItem.getId()}`}
                        page={page}
                        question={question}
                        item={questionSubItem}
                        plainText={false}
                        index={index}
                        exclusive={subItemExclusive}
                        additionalInput={subItemAdditionalInput}
                        subItem
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
  createValidationEditor() {
    const {
      page,
      question,
      min,
      max,
      checkCount,
      totalEqualTo,
    } = this.props;

    // 一つも編集可能となっていない場合は描画しない
    if (!(
      min ||
      max ||
      totalEqualTo ||
      checkCount ||
      (question.getMatrixType() === 'number' && question.isMatrixSumCols()) ||
      (question.getMatrixType() === 'number' && question.isMatrixSumRows()))
    ) {
      return null;
    }

    return (
      <form ref={(el) => { this.formEl = el; }}>
        <h5>入力値制限</h5>
        { min ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>最小値</Col>
            <Col md={10}>
              <ValueEditorPart page={page} question={question} attr="min" value={question.getMin()} />
            </Col>
          </FormGroup> : null }
        { max ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>最大値</Col>
            <Col md={10}>
              <ValueEditorPart page={page} question={question} attr="max" value={question.getMax()} />
            </Col>
          </FormGroup> : null }
        { totalEqualTo && question.isShowTotal() ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>合計値</Col>
            <Col md={10}>
              <FormGroup>
                <InputGroup>
                  <ValueEditorPart page={page} question={question} attr="totalEqualTo" value={question.getTotalEqualTo()} />
                  <InputGroup.Addon>になるように制限する</InputGroup.Addon>
                </InputGroup>
              </FormGroup>
            </Col>
          </FormGroup> : null }
        { question.getMatrixType() === 'number' && question.isMatrixSumRows() ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>行の合計値</Col>
            <Col md={10}>
              <ItemValidationEditorPart page={page} question={question} items={question.getItems()} labelPostfix="行目" />
            </Col>
          </FormGroup> : null }
        { question.getMatrixType() === 'number' && question.isMatrixSumCols() ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>列の合計値</Col>
            <Col md={10}>
              <ItemValidationEditorPart page={page} question={question} items={question.getSubItems()} labelPostfix="列目" />
            </Col>
          </FormGroup> : null }
        { checkCount ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>チェック数制限</Col>
            <Col md={10}>
              <div className="form-inline">
                <label htmlFor="dummy">最小</label>
                <FormControl componentClass="select" value={question.getMinCheckCount()} onChange={e => this.handleChangeQuestionAttribute('minCheckCount', parseInt(e.target.value, 10))}>
                  {question.getItems().map((c, i) => {
                    const key = `${page.getId()}-${question.getId()}-minCheckCount-${i}`;
                    return <option key={key} value={i}>{i === 0 ? '制限なし' : i}</option>;
                  })}
                  <option value={question.getItems().size}>{question.getItems().size}</option>;
                </FormControl>
                <label htmlFor="dummy">最大</label>
                <FormControl componentClass="select" value={question.getMaxCheckCount()} onChange={e => this.handleChangeQuestionAttribute('maxCheckCount', parseInt(e.target.value, 10))}>
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
        {this.createEachEditor()}
        {this.createValidationEditor()}
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
});
const actionsToProps = dispatch => ({
  changeQuestionAttribute: (pageId, questionId, attribute, value) =>
    dispatch(EditorActions.changeQuestionAttribute(pageId, questionId, attribute, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(BaseQuestionEditor);
