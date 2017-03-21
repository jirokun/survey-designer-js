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

  /** 定義をもとに関数を作成する */
  createFunctionCode(allOutputDefinitionMap) {
    let code = 'return ';
    const operands = this.getOperands();
    const operators = this.getOperators();
    operands.map(operand => allOutputDefinitionMap.get(operand)).forEach((od, i) => {
      if (i > 0) {
        code += `${operators.get(i - 1)}`;
      }
      code += `parseInt(answers['${od.getName()}'], 10)`;
    });
    return code;
  }
}
