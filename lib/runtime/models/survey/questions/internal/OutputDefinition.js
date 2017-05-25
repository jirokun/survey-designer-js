import { Record } from 'immutable';

/** 回答データの1列に相当する定義 */
export const OutputDefinitionRecord = Record({
  _id: null,           // 内部で使用するIDでitemの移動やnodeの移動があっても変わらない
  name: null,          // サーバにpostするときにキーとなる属性に使われる値
  label: null,         // 表示用のラベル
  dlLabel: null,       // DL時に使用するカラムのラベル
  questionId: null,    // 対応するquestionId  ####questionとの紐付けをサーバに保存するために定義
  question: null,      // 対応するquestion    ####この項目は容量が大きくなるためサーバサイドに保存しない
  outputType: null,    // この出力データの種類。checkbox, radio, text, numberがある
  choices: null,       // 選択肢
  outputNo: null,      // ユーザフレンドリなoutputDefitionのユニークな番号
  downloadable: true,  // 回答データDL時に出力する項目かどうか
  prependValue: null,  // 回答データDL時に先頭につける文字列
});

export default class OutputDefinition extends OutputDefinitionRecord {
  getId() {
    return this.get('_id');
  }

  getName() {
    return this.get('name');
  }

  getLabel() {
    return this.get('label');
  }

  getDlLabel() {
    return this.get('dlLabel');
  }

  getOutputType() {
    return this.get('outputType');
  }

  getChoices() {
    return this.get('choices');
  }

  getPageId() {
    return this.get('pageId');
  }

  getQuestion() {
    return this.get('question');
  }

  getOutputNo() {
    return this.get('outputNo');
  }

  /** outputNoがついたlabelを返す. 例: 1-1-1 選択肢1 */
  getLabelWithOutputNo() {
    return `${this.getOutputNo()} ${this.getLabel()}`;
  }

  /** outputNoがついたchoiceのlabelを返す. 例: 1-1(1) 選択肢1 */
  getChoiceLabelWithOutputNo(choiceIndex) {
    return `${this.getOutputNo()}(${choiceIndex + 1}) ${this.getChoices().get(choiceIndex).getLabel()}`;
  }

  getPrependValue() {
    return this.get('prependValue');
  }

  // 条件のoptionで使用するラベルを返す
  getLabelForCondition(natural = false) {
    const label = this.getLabelWithOutputNo();
    if (!natural) return label;
    const outputType = this.getOutputType();
    switch (outputType) {
      case 'checkbox':
        return label;
      case 'radio':
      case 'text':
      case 'number':
        return `${label} の値が`;
      default:
        throw new Error(`不正なoutputTypeです: ${outputType}`);
    }
  }
}
