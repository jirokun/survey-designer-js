import { Record, List, Map, OrderedMap } from 'immutable';
import ItemDefinition from './ItemDefinition';
import NumberValidationRuleDefinition from './NumberValidationRuleDefinition';
import NumberValidationDefinition from './NumberValidationDefinition';
import { cloneRecord } from '../../../../../utils';

export const BaseQuestionDefinitionRecord = Record({
  _id: null,
  devId: null,                                     // JavaScriptで指定するためのid
  dataType: 'Checkbox',                            // 設問のタイプ
  title: '設問タイトル',                             // タイトル
  plainTitle: '設問タイトル',                        // タイトル。HTMLではなくプレーンなテキスト。
  description: '',                                 // 補足
  random: false,                                   // ランダム
  subItemsRandom: false,                           // subItemsをランダム
  unit: '',                                        // 単位
  items: List(),                                   // アイテムのリスト
  subItems: List(),                                // サブアイテムのリスト
  showTotal: false,                                // 合計を表示するかどうか
  matrixType: null,                                // MatrixQuestionの入力項目のタイプを指定するradio, checkbox, text, numberが使用可能
  matrixReverse: false,                            // MatrixQuestionの行と列を入れ替えるかどうか
  matrixSumRows: false,                            // Matrixの列合計を表示するか
  matrixSumCols: false,                            // Matrixの行合計を表示するか
  matrixColVerticalWriting: false,                 // Matrixの行ヘッダを縦書きするか
  
  // バリデーション系
  totalEqualTo: '',                              // 合計値がここに設定した値になるよう制限する
  minCheckCount: 1,                              // チェックボックスの最低選択数
  maxCheckCount: 0,                              // チェックボックスの最大選択数
  min: '',                                       // 最小値
  max: '',                                       // 最大値

  numberValidationRuleMap: Map(),                      // 検証の定義のリスト
});

export default class BaseQuestionDefinition extends BaseQuestionDefinitionRecord {
  /** outputNoを生成する */
  static createOutputNo(...args) {
    return args.join('-');
  }

  /** ランダム配置する */
  static randomize(items) {
    const state = items.map(() => false).toArray();
    const randomItems = items.map((item, i) => {
      if (item.isRandomFixed()) {
        state[i] = true;
        return item;
      }
      // 次のindexを探す
      let index = Math.floor(Math.random() * items.size);
      for (;; index++) {
        if (state.length <= index) {
          // 最大値を超えたら0からやりなおし
          index = -1;
        } else if (items.get(index).isRandomFixed()) {
          // randomFixedのitemは対象外
        } else if (state[index]) {
          // すでに選択済みであればパスする
        } else {
          // 該当のindexを選択する
          state[index] = true;
          return items.get(index);
        }
      }
    }).toList();
    return randomItems;
  }

  getId() { return this.get('_id'); }
  getDevId() { return this.get('devId'); }
  getDataType() { return this.get('dataType'); }
  getTitle() { return this.get('title'); }
  getPlainTitle() { return this.get('plainTitle'); }
  getDescription() { return this.get('description'); }
  isRandom() { return this.get('random'); }
  isSubItemsRandom() { return this.get('subItemsRandom'); }
  isShowTotal() { return this.get('showTotal'); }
  getItems() { return this.get('items'); }
  getSubItems() { return this.get('subItems'); }
  getMatrixType() { return this.get('matrixType'); }
  isMatrixReverse() { return this.get('matrixReverse'); }
  isMatrixSumRows() { return this.get('matrixSumRows'); }
  isMatrixSumCols() { return this.get('matrixSumCols'); }
  getUnit() { return this.get('unit'); }
  getMinCheckCount() { return this.get('minCheckCount'); }
  getMaxCheckCount() { return this.get('maxCheckCount'); }
  getMin() { return this.get('min'); }
  getMax() { return this.get('max'); }
  getTotalEqualTo() { return this.get('totalEqualTo'); }
  getNumberValidationRuleMap() { return this.get('numberValidationRuleMap'); }
  isMatrixColVerticalWriting() { return this.get('matrixColVerticalWriting'); }
  
  /** choiceの選択肢の参照値を返す */
  getChoiceReference(choice) {
    return `{{${choice.getId()}.choice_value}}`;
  }

  /** ランダムなどの変換済みのitemsを返す */
  getTransformedItems(disableTransformQuestion = false) {
    const items = this.getItems();
    if (this.isRandom() && !disableTransformQuestion) {
      return BaseQuestionDefinition.randomize(items);
    }
    return items;
  }

  /** ランダムなどの変換済みのitemsを返す */
  getTransformedSubItems(disableTransformQuestion = false) {
    const items = this.getSubItems();
    if (this.isSubItemsRandom() && !disableTransformQuestion) {
      return BaseQuestionDefinition.randomize(items);
    }
    return items;
  }

  /** indexの値を更新する */
  fixItemIndex() {
    return this.set('items', this.getItems().map((item, i) =>
      item
        .set('index', i)
        .set('value', `${i + 1}`),
    ).toList());
  }

  /** subIndexの値を更新する */
  fixSubItemIndex() {
    return this.set('subItems', this.getSubItems().map((item, i) =>
      item
        .set('index', i)
        .set('value', `${i + 1}`),
    ).toList());
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions(pageNo, questionNo) {
    return List();
  }

  addNumberValidation(outputDefinitionId, numberValidationOptions = {}) {
    return this.updateIn(['numberValidationRuleMap', outputDefinitionId], (validationRules) => {
      const validationRule = validationRules ? validationRules.get(0) : NumberValidationRuleDefinition.create();

      return List.of(validationRule.addNumberValidation(numberValidationOptions));
    }).updateNumberValidationTypeInQuestion(outputDefinitionId);
  }

  removeNumberValidationRule(outputDefinitionId) {
    return this.removeIn(['numberValidationRuleMap', outputDefinitionId]);
  }

  removeNumberValidation(outputDefinitionId, numberValidationId) {
    const numberValidations = this.getIn(['numberValidationRuleMap', outputDefinitionId, 0, 'numberValidations']);
    if (numberValidations.size === 1) {
      return this.removeNumberValidationRule(outputDefinitionId);
    }
    const numberValidationIndex = numberValidations.findIndex(validation => validation.getId() === numberValidationId);
    if (numberValidationIndex === -1) throw new Error(`Invalid numberValidationId ${numberValidationId}`);
    return this.removeIn(['numberValidationRuleMap', outputDefinitionId, 0, 'numberValidations', numberValidationIndex]);
  }

  /** numberValidationIdからNumberValidationRuleを探して返す */
  findNumberValidationRule(numberValidationRuleId) {
    return this.getNumberValidationRuleMap().map(nvrm => nvrm.get(0))
      .toList()
      .find(nuberValidationRule => nuberValidationRule.getId() === numberValidationRuleId);
  }

  /** outputDefinitionIdからNumberValidationRuleを探して返す */
  findNumberValidationRuleFromOutputDefinitionId(outputDefinitionId) {
    const numberValidatinoRules = this.getNumberValidationRuleMap().get(outputDefinitionId);
    if (numberValidatinoRules) return numberValidatinoRules.get(0);
    return null;
  }

  /**
   * validationTypeInQuestionでユニーク化したNumberValidatinoRuleのListを取得する
   * ユニーク化のキーとしてvalidationTypeInQuestionを使用する
   */
  getUniquedNumberValidationRules() {
    const numberValidationRuleMap = this.getNumberValidationRuleMap();
    const uniquedNumberValidationRuleMap = OrderedMap().asMutable();
    numberValidationRuleMap
      .keySeq()
      .map(key => this.findNumberValidationRuleFromOutputDefinitionId(key))
      .forEach((nvr) => {
        const key = nvr.getValidationTypeInQuestion();
        uniquedNumberValidationRuleMap.set(key, nvr);
      });
    return uniquedNumberValidationRuleMap.toList().sortBy(nvr => nvr.getValidationTypeInQuestion());
  }

  /** 数値の検証処理の属性を変更する */
  updateNumberValidationAttribute(outputDefinitionId, numberValidationId, attr, value) {
    const numberValidations = this.getIn(['numberValidationRuleMap', outputDefinitionId, 0, 'numberValidations']);
    const validationIndex = numberValidations.findIndex(validation => validation.getId() === numberValidationId);
    const newQuestion = this.setIn(['numberValidationRuleMap', outputDefinitionId, 0, 'numberValidations', validationIndex, attr], value);
    return newQuestion.updateNumberValidationTypeInQuestion(outputDefinitionId);
  }

  /** 数値の検証処理の属性を変更する */
  updateNumberValidationRule(outputDefinitionId, numberValidationRule) {
    // 一つでもnumberValidationがある場合は更新する
    if (numberValidationRule.getNumberValidations().size > 0) {
      return this
        .update('numberValidationRuleMap', map => map.set(outputDefinitionId, List.of(numberValidationRule)))
        .updateNumberValidationTypeInQuestion(outputDefinitionId);
    }
    // 一つもnumberValidationがない場合は削除する
    return this.removeNumberValidationRule(outputDefinitionId);
  }

  /** numberValidationRuleのmapに格納するためのkeyを導出する */
  calcNumberValidationRuleKey(numberValidationRule) {
    return numberValidationRule.getNumberValidations().map(nv => `${nv.getValue()}\t${nv.getOperator()}`).join('\t');
  }

  /**
   * targetOutputDefinitionIdに対応するNumberValidationRuleのvalidationTypeInQuestionを更新する
   * 同じ値のものがあれば同じ値をセットし、なければ1から1000までのうち未使用のものを採番する。
   */
  updateNumberValidationTypeInQuestion(targetOutputDefinitionId) {
    let typeInQuestionMap = Map();
    const outputDefinitions = this.getOutputDefinitions();
    const numberValidationRuleMap = this.getNumberValidationRuleMap();
    const existNumberArray = [];
    outputDefinitions.forEach((od) => {
      if (!numberValidationRuleMap.has(od.getId()) || od.getId() === targetOutputDefinitionId) return;
      const numberValidationRule = this.findNumberValidationRuleFromOutputDefinitionId(od.getId());
      const key = this.calcNumberValidationRuleKey(numberValidationRule);
      typeInQuestionMap = typeInQuestionMap.set(key, numberValidationRule);
      existNumberArray[numberValidationRule.getValidationTypeInQuestion()] = true;
    });
    const targetNumberValidationRule = this.findNumberValidationRuleFromOutputDefinitionId(targetOutputDefinitionId);
    const targetKey = this.calcNumberValidationRuleKey(targetNumberValidationRule);

    if (typeInQuestionMap.has(targetKey)) {
      const originalNumberValidationRule = typeInQuestionMap.get(targetKey);
      const originalvalidationTypeInQuestion = originalNumberValidationRule.getValidationTypeInQuestion();
      return this.setIn(['numberValidationRuleMap', targetOutputDefinitionId, 0, 'validationTypeInQuestion'], originalvalidationTypeInQuestion);
    }
    for (let i = 1; i < 1000; i++) {
      if (existNumberArray[i]) continue;
      return this.setIn(['numberValidationRuleMap', targetOutputDefinitionId, 0, 'validationTypeInQuestion'], i);
    }
    throw new Error(`Cannot update numberValidationTypeInQuestion. targetOutputDefinitionId = ${targetOutputDefinitionId}`);
  }

  /** 数値の検証処理の属性を変更する */
  copyNumberValidationRules(survey, copyDataList) {
    let newQuestion = this;
    copyDataList.forEach((copyData) => {
      const sourceNumberValidationRule = survey.findNumberValidationRuleById(copyData.sourceNumberValidationRuleId);
      if (sourceNumberValidationRule) {
        newQuestion = newQuestion.setIn(['numberValidationRuleMap', copyData.targetOutputDefinitionId], List.of(cloneRecord(sourceNumberValidationRule)));
      } else {
        newQuestion = newQuestion.removeIn(['numberValidationRuleMap', copyData.targetOutputDefinitionId]);
      }
    });
    return newQuestion;
  }

  /**
   * ゴミを削除する
   */
  clean(survey, page) {
    return this.update('numberValidationRuleMap', (numberValidationRuleMap) => {
      let newNumberValidationRuleMap = numberValidationRuleMap;
      const pageNo = survey.calcPageNo(page.getId());
      const questionNo = survey.calcQuestionNo(page.getId(), this.getId());
      const outputDefinitionIds = this.getOutputDefinitions(pageNo, questionNo).map(od => od.getId());
      numberValidationRuleMap.keySeq().forEach((key) => {
        if (outputDefinitionIds.includes(key)) return;
        newNumberValidationRuleMap = newNumberValidationRuleMap.delete(key);
      });
      return newNumberValidationRuleMap;
    });
  }

  /** 正しく設定されているかチェックする */
  validate(survey) {
    let errors = List();
    const replacer = survey.getReplacer();
    const page = survey.findPageFromQuestion(this.getId());
    const node = survey.findNodeFromRefId(page.getId());
    const outputDefinitions = survey.findPrecedingOutputDefinition(node.getId());
    if (!replacer.validate(this.getTitle(), outputDefinitions)) errors = errors.push('タイトルで存在しない参照があります');
    if (!replacer.validate(this.getDescription(), outputDefinitions)) errors = errors.push('補足で存在しない参照があります');
    if (!replacer.validate(this.getUnit(), outputDefinitions)) errors = errors.push('単位で存在しない参照があります');
    if (!replacer.validate(this.getMin(), outputDefinitions)) errors = errors.push('最小値で存在しない参照があります');
    if (!replacer.validate(this.getMax(), outputDefinitions)) errors = errors.push('最大値で存在しない参照があります');
    if (!replacer.validate(this.getTotalEqualTo(), outputDefinitions)) errors = errors.push('合計値で存在しない参照があります');

    const numberValidationRuleErrors = this.getNumberValidationRuleMap()
       .keySeq()
       .flatMap(key => this.findNumberValidationRuleFromOutputDefinitionId(key).validate(survey, page, this));
    errors = errors.concat(numberValidationRuleErrors.toSet());

    return errors;
  }
}
