import { Record, List } from 'immutable';
import cuid from 'cuid';

const LogicalVariableDefinitionRecord = Record({
  _id: null,
  variableName: '',           // 変数名
  operands: List(),           // オペランド。outputDefinitionのIDが入る
  operators: List(),          // オペレータ。+,-,*,/のいずれかが入る
});

/** ロジック変数の定義 */
export default class LogicalVariableDefinition extends LogicalVariableDefinitionRecord {
  static create() {
    const id = cuid();
    const operands = List().push('').push('');
    const operators = List().push('');
    return new LogicalVariableDefinition({ _id: id, operands, operators });
  }

  getId() {
    return this.get('_id');
  }

  getVariableName() {
    return this.get('variableName');
  }

  getOperators() {
    return this.get('operators');
  }

  getOperands() {
    return this.get('operands');
  }

  /** 定義をもとに関数の文字列を作成する */
  createFunctionCode(survey, page) {
    const node = survey.findNodeFromRefId(page.getId());
    // このページよりも前にある設問のOutputDefinition
    const precedingOutputDefinition = survey.findPrecedingOutputDefinition(node.getId(), false, false);
    // すべてのページの設問のOutputDefinition
    const allOutputDefinitionMap = survey.getAllOutputDefinitionMap();
    let code = 'return ';
    const operands = this.getOperands();
    const operators = this.getOperators();
  
    operands.forEach((operand, i) => {
      const outputDefinition = precedingOutputDefinition.find(od => od.getId() === operand);
      if (i > 0) {
        code += `${operators.get(i - 1)}`;
      }
      if (outputDefinition === undefined) {
        // 現在のページの値は入力値から取得する
        // ページ遷移時はanswersからも取得はできるが、ページ内バリデーションのタイミングでは画面から値を取得する必要がある
        code += `(parseInt($('*[name="${allOutputDefinitionMap.get(operand).getName()}"]:enabled:visible').val(), 10) || 0)`;
      } else {
        // 過去のページの値はanswersから取得する
        code += `(parseInt(answers['${outputDefinition.getName()}'], 10) || 0)`;
      }
    });
    return code;
  }

  /** 正しく設定されているかチェックする */
  validate(survey) {
    let errors = List();
    if (this.getOperators().findIndex(ope => ope === '') !== -1) {
      errors = errors.push(`${this.getVariableName()}で選択されていない演算子があります`);
    }
    const allOutputDefinitionMap = survey.getAllOutputDefinitionMap();
    if (this.getOperands().findIndex(opr => !(allOutputDefinitionMap.has(opr))) !== -1) {
      errors = errors.push(`${this.getVariableName()}で選択されていない設問があります`);
    }
    return errors;
  }
}
