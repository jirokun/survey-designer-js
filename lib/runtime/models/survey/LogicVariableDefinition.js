import { Record, List } from 'immutable';
import cuid from 'cuid';

const LogicVariableDefinitionRecord = Record({
  _id: null,
  variableName: '',           // 変数名
  operands: List(),           // オペランド。outputDefinitionのIDが入る
  operators: List(),          // オペレータ。+,-,*,/のいずれかが入る
});

/** ロジック変数の定義 */
export default class LogicVariableDefinition extends LogicVariableDefinitionRecord {
  static create() {
    const id = cuid();
    const operands = List().push('').push('');
    const operators = List().push('');
    return new LogicVariableDefinition({ _id: id, operands, operators });
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
}
