import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Tooltip, Popover, OverlayTrigger, Button, Col, FormGroup, ControlLabel, Checkbox, FormControl } from 'react-bootstrap';
import SubItemEditor from './SubItemEditor';
import ItemEditorPart from './parts/ItemEditorPart';
import HtmlEditorPart from './parts/HtmlEditorPart';
import Help from '../Help';
import { isDevelopment, parseInteger } from '../../../utils';
import ItemVisibilityEditorPart from './parts/ItemVisibilityEditorPart';
import NumberValidationEditorPart from './parts/NumberValidationEditorPart';
import BulkAddItemsEditorPart from './parts/BulkAddItemsEditorPart';
import MatrixTableEditorPart from './parts/MatrixTableEditorPart';
import * as EditorActions from '../../actions';
import BaseQuestionDefinition from '../../../runtime/models/survey/questions/internal/BaseQuestionDefinition';
import PersonalInfoQuestionDefinition from '../../../runtime/models/survey/questions/PersonalInfoQuestionDefinition';
import PersonalInfoItemEditorPart from './parts/PersonalInfoItemEditorPart';

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
  constructor(props) {
    super(props);

    this.state = {
      showValidationEditors: false, // 入力値制限の表示制御
      showMatrixTableEditor: false, // 表形式のHTMLエディタ
    };
  }

  componentWillReceiveProps(nextProps) {
    const { question } = this.props;
    // pageNo, questionNoは使用しないのでダミーの値を設定
    const oldOutputDefinitionIds = this.props.question.getOutputDefinitions('0', '0', question.getId()).map(od => od.getId()).join('');
    const newOutputDefinitionIds = nextProps.question.getOutputDefinitions('0', '0', question.getId()).map(od => od.getId()).join('');

    // 出力するOutputDefinitionのIDが変更になったら入力値制限の表示制御を閉じる
    if (newOutputDefinitionIds !== oldOutputDefinitionIds) {
      this.setState({ showValidationEditors: false });
    }
  }

  /** questionの属性が変更されたときのハンドラ */
  handleChangeQuestionAttribute(attribute, value) {
    const { page, question, changeQuestionAttribute } = this.props;
    changeQuestionAttribute(page.getId(), question.getId(), attribute, value);
  }

  handleChangeMatrixHtmlEnabled(enabled) {
    if (!enabled) {
      if (!confirm('編集したテーブルの内容が失われますがよろしいですか？')) return;
      this.handleChangeQuestionAttribute('matrixHtml', null);
    }
    this.handleChangeQuestionAttribute('matrixHtmlEnabled', enabled);
  }

  /** 一括追加ボタンが押されたときのハンドラ */
  handleItemBulkAddExecute() {
    this.bulkAddItemOverlay.hide();
  }

  /** 一括追加ボタンが押されたときのハンドラ */
  handleSubItemBulkAddExecute() {
    this.bulkAddSubItemOverlay.hide();
  }

  getTableHeaderOfItemEditor(question, items, createsUnitLabel, itemAdditionalInput, itemExclusive, optionalItem) {
    if (question instanceof PersonalInfoQuestionDefinition) {
      return (<thead>
        <tr>
          <th />
          <th />
          <th>任意</th>
          <th>表示形式</th>
        </tr>
      </thead>);
    }
    return (<thead>
      <tr>
        <th />
        <th />
        {createsUnitLabel ? <th>単位</th> : null}
        {this.getAdditionalInputTypeHeader(itemAdditionalInput, items)}
        {this.getAdditionalInputHeader(itemAdditionalInput, items)}
        {itemAdditionalInput ? <th>追加<br />入力</th> : <th />}
        {optionalItem ? <th>任意<br />入力</th> : null}
        {question.isRandom() ? <th>固定</th> : null}
        {itemExclusive ? <th>排他</th> : null}
        <th />
      </tr>
    </thead>);
  }

  /** 各項目のエディタを描画する */
  createEachEditor(disabled) {
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
      optional,
      subItemsRandom,
      item,
      subItem,
      showTotal,
      unit,
      itemExclusive,
      subItemExclusive,
      optionalItem,
      optionalSubItem,
      itemAdditionalInput,
      subItemAdditionalInput,
      itemPlainText,
      noEdit,
      changeQuestionAttribute,
      createsUnitLabel,
      createsSubUnitLabel,
      matrixColVerticalWriting,
      matrixHtmlEnabled,
      matrixRowAndColumnUnique,
    } = this.props;

    const questionNo = BaseQuestionDefinition.createOutputNo(
      survey.calcPageNo(page.getId()),
      survey.calcQuestionNo(page.getId(), question.getId()),
    );

    // noEditが指定された場合は編集不可能である旨を表示する
    if (noEdit) {
      return (
        <div>
          <h4 className="enq-title enq-title__page">{questionNo} {editorTitle}</h4>
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
              <HtmlEditorPart
                disabled={disabled}
                toolbar="italic underline strikethrough forecolor backcolor removeformat table link unlink fullscreen code reference_answer image_manager"
                onChange={(html, text) => {
                  changeQuestionAttribute(page.getId(), question.getId(), 'title', html, text);
                  changeQuestionAttribute(page.getId(), question.getId(), 'plainTitle', text);
                }}
                content={question.getTitle()}
              />
            </Col>
          </FormGroup> : null }
        { description ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>{description === true ? '補足' : description}</Col>
            <Col md={10}><HtmlEditorPart
              disabled={disabled}
              onChange={(html, text) => changeQuestionAttribute(page.getId(), question.getId(), 'description', html, text)}
              content={question.getDescription()}
            /></Col>
          </FormGroup> : null }
        { matrixType ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>{matrixType === true ? '設問タイプ' : matrixType}</Col>
            <Col md={10}>
              <FormControl
                disabled={disabled || question.isMatrixHtmlEnabled()}
                componentClass="select"
                value={question.getMatrixType()}
                onChange={e => this.handleChangeQuestionAttribute('matrixType', e.target.value)}
              >
                <option value="checkbox">チェックボックス</option>
                <option value="radio">ラジオ</option>
                <option value="text">テキスト</option>
                <option value="number">数値</option>
              </FormControl>
            </Col>
          </FormGroup> : null }
        { random || showTotal || optional ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>オプション</Col>
            <Col md={10}>
              { optional ?
                <Checkbox
                  disabled={disabled}
                  checked={question.isOptional()}
                  onChange={e => this.handleChangeQuestionAttribute('optional', e.target.checked)}
                >{optional === true ? '任意入力' : optional}</Checkbox> : null }
              { random ?
                <Checkbox
                  disabled={disabled}
                  checked={question.isRandom()}
                  onChange={e => this.handleChangeQuestionAttribute('random', e.target.checked)}
                >{random === true ? '選択肢の表示順をランダム表示' : random}</Checkbox> : null }
              { subItemsRandom ?
                <Checkbox
                  disabled={disabled}
                  checked={question.isSubItemsRandom()}
                  onChange={e => this.handleChangeQuestionAttribute('subItemsRandom', e.target.checked)}
                >{subItemsRandom === true ? '列項目をランダム表示' : subItemsRandom}</Checkbox> : null }
              { showTotal ?
                <Checkbox
                  disabled={disabled || question.isMatrixHtmlEnabled()}
                  checked={question.isShowTotal()}
                  onChange={e => this.handleChangeQuestionAttribute('showTotal', e.target.checked)}
                >{showTotal === true ? '入力値の合計を表示する' : showTotal}</Checkbox> : null }
              { matrixReverse ?
                <Checkbox
                  disabled={disabled || question.isMatrixHtmlEnabled()}
                  checked={question.isMatrixReverse()}
                  onChange={e => this.handleChangeQuestionAttribute('matrixReverse', e.target.checked)}
                ><Help messageId="matrixReverse" /> {matrixReverse === true ? '列でグルーピング' : matrixReverse}</Checkbox> : null }
              { matrixSumRows ?
                <Checkbox
                  disabled={disabled || question.isMatrixHtmlEnabled()}
                  checked={question.isMatrixSumRows()}
                  onChange={e => this.handleChangeQuestionAttribute('matrixSumRows', e.target.checked)}
                >{matrixSumRows === true ? '行の合計値を表示' : matrixSumRows}</Checkbox> : null }
              { matrixSumCols ?
                <Checkbox
                  disabled={disabled || question.isMatrixHtmlEnabled()}
                  checked={question.isMatrixSumCols()}
                  onChange={e => this.handleChangeQuestionAttribute('matrixSumCols', e.target.checked)}
                >{matrixSumCols === true ? '列の合計値を表示' : matrixSumCols}</Checkbox> : null }
              { matrixColVerticalWriting ?
                <Checkbox
                  disabled={disabled || question.isMatrixHtmlEnabled()}
                  checked={question.isMatrixColVerticalWriting()}
                  onChange={e => this.handleChangeQuestionAttribute('matrixColVerticalWriting', e.target.checked)}
                >{matrixColVerticalWriting === true ? '列ヘッダを縦書き' : matrixColVerticalWriting}</Checkbox> : null }
              { matrixHtmlEnabled ?
                <div>
                  <Checkbox
                    inline
                    disabled={disabled}
                    className={classNames({ disabled })}
                    checked={question.isMatrixHtmlEnabled()}
                    onChange={e => this.handleChangeMatrixHtmlEnabled(e.target.checked)}
                  ><Help messageId="matrixHtmlEnabled" /> {matrixHtmlEnabled === true ? 'テーブルをカスタマイズ' : matrixHtmlEnabled}</Checkbox>&nbsp;
                  <Button
                    disabled={disabled}
                    className={classNames({ hidden: !question.isMatrixHtmlEnabled() })}
                    bsStyle="primary"
                    bsSize="xsmall"
                    onClick={() => this.setState({ showMatrixTableEditor: true })}
                  >編集</Button></div> : null }
              { matrixRowAndColumnUnique ?
                <div>
                  <Checkbox
                    inline
                    disabled={disabled}
                    className={classNames({ disabled })}
                    checked={question.isMatrixRowAndColumnUnique()}
                    onChange={e => this.handleChangeQuestionAttribute('matrixRowAndColumnUnique', e.target.checked)}
                  >{matrixRowAndColumnUnique === true ? '縦方向にユニーク制約をつける' : matrixRowAndColumnUnique}</Checkbox></div> : null }
            </Col>
          </FormGroup> : null }
        { this.state.showMatrixTableEditor ? <MatrixTableEditorPart question={question} onHide={() => this.setState({ showMatrixTableEditor: false })} /> : null }
        { item ?
          <FormGroup>
            <div className="col-md-2 control-label">
              <div>{item === true ? '選択肢' : item}</div>
              <div>
                <OverlayTrigger
                  rootClose
                  trigger="click"
                  placement="right"
                  overlay={
                    <Popover id={`${question.getId()}_item_visibility_condition_popover`} title="表示制御" className="item-visibility-condition-popover">
                      <ItemVisibilityEditorPart items={question.getItems()} {...this.props} />
                    </Popover>
                  }
                >
                  <Button className={classNames({ invisible: disabled })} bsSize="xsmall" bsStyle="link">表示制御 <Help messageId="itemVisibility" /></Button>
                </OverlayTrigger>
              </div>
              <div className={classNames({ invisible: disabled || question.isMatrixHtmlEnabled() })}>
                <OverlayTrigger
                  ref={(el) => { this.bulkAddItemOverlay = el; }}
                  rootClose
                  trigger="click"
                  placement="right"
                  overlay={
                    <Popover id={`${question.getId()}_item_bulk_add_popover`} title="一括追加" className="item-bulk-add-popover">
                      <BulkAddItemsEditorPart page={page} question={question} handleExecute={() => this.handleItemBulkAddExecute()} />
                    </Popover>
                  }
                >
                  <Button bsSize="xsmall" bsStyle="link">一括追加</Button>
                </OverlayTrigger>
              </div>
            </div>
            <Col md={10}>
              <div className="item-editor">
                <table className="item-editor-table">
                  {this.getTableHeaderOfItemEditor(question, items, createsUnitLabel, itemAdditionalInput, itemExclusive, optionalItem)}
                  <tbody>
                    {items.map((questionItem, index) => {
                      if (question instanceof PersonalInfoQuestionDefinition) {
                        return (<PersonalInfoItemEditorPart
                          key={`BaseQuestionEditor_ItemEditorParts_${questionItem.getId()}`}
                          page={page}
                          question={question}
                          item={questionItem}
                          plainText={itemPlainText}
                          index={index}
                          exclusive={itemExclusive}
                          additionalInput={itemAdditionalInput}
                          subItem={false}
                          createsUnitLabel={createsUnitLabel}
                          optionalItem={optionalItem}
                          disabled={disabled}
                        />);
                      }
                      return (<ItemEditorPart
                        key={`BaseQuestionEditor_ItemEditorParts_${questionItem.getId()}`}
                        page={page}
                        question={question}
                        item={questionItem}
                        plainText={itemPlainText}
                        index={index}
                        exclusive={itemExclusive}
                        additionalInput={itemAdditionalInput}
                        subItem={false}
                        createsUnitLabel={createsUnitLabel}
                      />);
                    })}
                  </tbody>
                </table>
              </div>
            </Col>
          </FormGroup> : null }
        { subItem ?
          <FormGroup>
            <div className="col-md-2 control-label">
              <div>{subItem === true ? '選択肢' : subItem}</div>
              <div className={classNames({ invisible: disabled })}>
                <OverlayTrigger
                  rootClose
                  trigger="click"
                  placement="right"
                  overlay={
                    <Popover id={`${question.getId()}_subItem_visibility_condition_popover`} title="表示制御" className="item-visibility-condition-popover">
                      <ItemVisibilityEditorPart items={question.getSubItems()} {...this.props} subItem />
                    </Popover>
                  }
                >
                  <Button
                    bsSize="xsmall"
                    bsStyle="link"
                  >表示制御 <Help messageId="itemVisibility" /></Button>
                </OverlayTrigger>
              </div>
              <div className={classNames({ invisible: disabled || question.isMatrixHtmlEnabled() })}>
                <OverlayTrigger
                  ref={(el) => { this.bulkAddSubItemOverlay = el; }}
                  rootClose
                  trigger="click"
                  placement="right"
                  overlay={
                    <Popover id={`${question.getId()}_item_bulk_add_popover`} title="一括追加" className="item-bulk-add-popover">
                      <BulkAddItemsEditorPart page={page} question={question} handleExecute={() => this.handleSubItemBulkAddExecute()} isTargetSubItems />
                    </Popover>
                  }
                >
                  <Button bsSize="xsmall" bsStyle="link">一括追加</Button>
                </OverlayTrigger>
              </div>
            </div>
            <Col md={10}>
              <div className="item-editor">
                <table className="item-editor-table">
                  <thead>
                    <tr>
                      <th />
                      <th />
                      {createsSubUnitLabel ? <th>単位</th> : null}
                      {this.getAdditionalInputTypeHeader(subItemAdditionalInput, subItems)}
                      {this.getAdditionalInputHeader(subItemAdditionalInput, subItems)}
                      {subItemAdditionalInput ? <th>追加<br />入力</th> : <th /> }
                      {optionalSubItem ? <th>任意<br />入力</th> : null}
                      {question.isSubItemsRandom() ? <th>固定</th> : null}
                      {subItemExclusive ? <th>排他</th> : null}
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {subItems.map((questionSubItem, index) =>
                      <SubItemEditor
                        key={`BaseQuestionEditor_ItemEditor_${questionSubItem.getId()}`}
                        page={page}
                        question={question}
                        item={questionSubItem}
                        plainText={false}
                        index={index}
                        exclusive={subItemExclusive}
                        additionalInput={subItemAdditionalInput}
                        subItem
                        createsUnitLabel={createsSubUnitLabel}
                        optionalItem={optionalSubItem}
                        disabled={disabled}
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
              <FormControl
                disabled={disabled}
                componentClass="input"
                value={question.getUnit()}
                onChange={e => this.handleChangeQuestionAttribute('unit', e.target.value)}
              />
            </Col>
          </FormGroup> : null }
      </div>
    );
  }

  getAdditionalInputHeader(additionalInput, items) {
    const { question } = this.props;
    if (question.getMatrixType()) { return null; }
    return additionalInput && items.find(i => i.hasAdditionalInput()) ? <th>単位</th> : <th />;
  }

  getAdditionalInputTypeHeader(additionalInput, items) {
    return additionalInput && items.find(i => i.hasAdditionalInput()) ? <th>入力<br />タイプ</th> : <th />;
  }

  createCheckCountValidationEditorRow(minCheckCountValue, maxCheckCountValue, maxCount, onMinChangeHandler, onMaxChangeHandler, rowLabel) {
    const minOptions = [];
    const maxOptions = [];
    for (let i = 0; i <= maxCount; i++) {
      const keyBase = `check-count-validation-editor-row-${rowLabel}`;
      minOptions.push(<option key={`${keyBase}-min-${i}`} value={i}>{i === 0 ? '制限なし' : i}</option>);
      maxOptions.push(<option key={`${keyBase}-max-${i}`} value={i}>{i === 0 ? '制限なし' : i}</option>);
    }

    return (
      <div key={`matrix-check-count-validation-${rowLabel}`} className="form-inline">
        { rowLabel ? <label htmlFor="dummy" className="matrix-check-count-validation-label">{rowLabel}</label> : null }
        <label htmlFor="dummy">最小</label>
        <FormControl componentClass="select" value={minCheckCountValue} onChange={onMinChangeHandler}>
          {minOptions}
        </FormControl>
        <label htmlFor="dummy">最大</label>
        <FormControl componentClass="select" value={maxCheckCountValue} onChange={onMaxChangeHandler}>
          {maxOptions}
        </FormControl>
      </div>
    );
  }

  createCheckCountValidationEditor() {
    const {
      page,
      question,
      checkCount,
      changeItemAttribute,
      changeSubItemAttribute,
    } = this.props;

    if (!checkCount) return null;

    if (question.dataType === 'Matrix') {
      if (question.isMatrixReverse()) {
        return question.getSubItems().map((subItem, i) => this.createCheckCountValidationEditorRow(
            subItem.getMinCheckCount(),
            subItem.getMaxCheckCount(),
            question.getItems().size,
            e => changeSubItemAttribute(page.getId(), question.getId(), subItem.getId(), 'minCheckCount', parseInteger(e.target.value)),
            e => changeSubItemAttribute(page.getId(), question.getId(), subItem.getId(), 'maxCheckCount', parseInteger(e.target.value)),
            `${i + 1} 列目`,
          ));
      }
      return question.getItems().map((item, i) => this.createCheckCountValidationEditorRow(
            item.getMinCheckCount(),
            item.getMaxCheckCount(),
            question.getSubItems().size,
            e => changeItemAttribute(page.getId(), question.getId(), item.getId(), 'minCheckCount', parseInteger(e.target.value)),
            e => changeItemAttribute(page.getId(), question.getId(), item.getId(), 'maxCheckCount', parseInteger(e.target.value)),
            `${i + 1} 行目`,
          ));
    }

    return this.createCheckCountValidationEditorRow(
      question.getMinCheckCount(),
      question.getMaxCheckCount(),
      question.getItems().size,
      e => this.handleChangeQuestionAttribute('minCheckCount', parseInteger(e.target.value)),
      e => this.handleChangeQuestionAttribute('maxCheckCount', parseInteger(e.target.value)),
    );
  }

  createValidationEditors(numberTypeOutputDefinitions, disabled) {
    const {
      question,
      checkCount,
    } = this.props;

    if (!this.state.showValidationEditors || disabled) return null;

    return (
      <div>
        { checkCount ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>チェック数</Col>
            <Col md={10}>{this.createCheckCountValidationEditor()}</Col>
          </FormGroup> : null }
        { numberTypeOutputDefinitions.size !== 0 ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>数値</Col>
            <Col md={10}>
              <NumberValidationEditorPart items={question.getItems()} disabled={disabled} {...this.props} />
            </Col>
          </FormGroup> : null }
      </div>
    );
  }

  /** 各項目のバリデーションのエディタを描画する */
  createValidationContainer(disabled) {
    const {
      survey,
      page,
      question,
      checkCount,
    } = this.props;

    const pageNo = survey.calcPageNo(page.getId());
    const outputDefinitions = question.getOutputDefinitions(pageNo, survey.calcQuestionNo(page.getId(), question.getId()));
    const numberTypeOutputDefinitions = outputDefinitions.filter(od => od.getOutputType() === 'number');

    // 一つも編集可能となっていない場合は描画しない
    if (!checkCount && numberTypeOutputDefinitions.size === 0) return null;

    return (
      <form>
        <h5 className="clickable" onClick={() => this.setState({ showValidationEditors: !this.state.showValidationEditors })}>
          { this.state.showValidationEditors ? '▼' : '▶' }
          入力値制限
        </h5>
        {this.createValidationEditors(numberTypeOutputDefinitions, disabled)}
      </form>
    );
  }

  /** 描画 */
  render() {
    const disabled = !isDevelopment() && this.props.page.isFreeMode();
    return (
      <div>
        {this.createEachEditor(disabled)}
        {this.createValidationContainer(disabled)}
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
  changeItemAttribute: (pageId, questionId, itemId, attributeName, value) =>
    dispatch(EditorActions.changeItemAttribute(pageId, questionId, itemId, attributeName, value)),
  changeSubItemAttribute: (pageId, questionId, subItemId, attributeName, value) =>
    dispatch(EditorActions.changeSubItemAttribute(pageId, questionId, subItemId, attributeName, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(BaseQuestionEditor);
