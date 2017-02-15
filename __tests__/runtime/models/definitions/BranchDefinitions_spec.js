/* eslint-env jest */
import { Map } from 'immutable';
import BranchDefinition from '../../../../lib/runtime/models/definitions/BranchDefinition';
import { json2ImmutableState } from '../../../../lib/runtime/store';

describe('BranchDefinition', () => {
  describe('evaluateConditions', () => {
    describe('conditionTypeがall', () => {
      it('operatorが==のときすべての条件が真であれば正しいnodeIdが返ること', () => {
        const answers = new Map()
          .set('O001', '123')
          .set('O002', '234');
        const parsedObj = json2ImmutableState({
          conditions: [
            {
              _id: 'C001',
              conditionType: 'all',
              nextNodeId: 'N001',
              childConditions: [
                { _id: 'CC001', outputId: 'O001', operator: '==', value: '123', },
                { _id: 'CC002', outputId: 'O002', operator: '==', value: '234', },
              ],
            },
          ],
        }, true);
        const conditions = parsedObj.get('conditions');
        const branch = new BranchDefinition({ _id: 'B001', conditions });
        const result = branch.evaluateConditions(answers);
        expect(result).toBe('N001');
      });

      it('operatorが==のときすべての条件が真でない場合nullが返ること', () => {
        const answers = new Map()
          .set('O001', '123')
          .set('O002', '234');
        const parsedObj = json2ImmutableState({
          conditions: [
            {
              _id: 'C001',
              conditionType: 'all',
              nextNodeId: 'N001',
              childConditions: [
                { _id: 'CC001', outputId: 'O001', operator: '==', value: '123', },
                { _id: 'CC002', outputId: 'O002', operator: '==', value: '235', },
              ],
            },
          ],
        }, true);
        const conditions = parsedObj.get('conditions');
        const branch = new BranchDefinition({ _id: 'B001', conditions });
        const result = branch.evaluateConditions(answers);
        expect(result).toBe(null);
      });
    });

    describe('conditionTypeがsome', () => {
      it('operatorが==のときすべてのひとつ真があれば正しいnodeIdが返ること', () => {
        const answers = new Map()
          .set('O001', '123')
          .set('O002', '234');
        const parsedObj = json2ImmutableState({
          conditions: [
            {
              _id: 'C001',
              conditionType: 'some',
              nextNodeId: 'N001',
              childConditions: [
                { _id: 'CC001', outputId: 'O001', operator: '==', value: '124' },
                { _id: 'CC002', outputId: 'O002', operator: '==', value: '234' },
              ],
            },
          ],
        }, true);
        const conditions = parsedObj.get('conditions');
        const branch = new BranchDefinition({ _id: 'B001', conditions });
        const result = branch.evaluateConditions(answers);
        expect(result).toBe('N001');
      });

      it('operatorが==のとき一つも条件が真でない場合nullが返ること', () => {
        const answers = new Map()
          .set('O001', '123')
          .set('O002', '234');
        const parsedObj = json2ImmutableState({
          conditions: [
            {
              _id: 'C001',
              conditionType: 'some',
              nextNodeId: 'N001',
              childConditions: [
                { _id: 'CC001', outputId: 'O001', operator: '==', value: '' },
                { _id: 'CC002', outputId: 'O002', operator: '==', value: '' },
              ],
            },
          ],
        }, true);
        const conditions = parsedObj.get('conditions');
        const branch = new BranchDefinition({ _id: 'B001', conditions });
        const result = branch.evaluateConditions(answers);
        expect(result).toBe(null);
      });
    });
  });
});
