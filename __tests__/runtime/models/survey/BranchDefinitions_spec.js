/* eslint-env jest */
import { Map } from 'immutable';
import SurveyDesignerState from '../../../../lib/runtime/models/SurveyDesignerState';
import sample from './BranchDefinitions.json';

describe('BranchDefinition', () => {
  let state;
  beforeAll(() => {
    state = SurveyDesignerState.createFromJson({ survey: sample });
  });

  describe('evaluateConditions', () => {
    describe('conditionTypeがall', () => {
      it('operatorが==のときすべての条件が真であれば正しいnodeIdが返ること', () => {
        const answers = new Map()
          .set('e27c61fa-6c32-4a10-893f-e280bc089b9d__value1', 'on')
          .set('e27c61fa-6c32-4a10-893f-e280bc089b9d__value2', 'on');
        const parsedObj = SurveyDesignerState.createFromJson({
          conditions: [
            {
              _id: 'C001',
              conditionType: 'all',
              nextNodeId: 'N001',
              childConditions: [
                { _id: 'CC001', outputId: 'b2c453ee-b3b1-47fd-8d52-cb693156f43c', operator: '==', value: 'on' },
                { _id: 'CC001', outputId: 'f7e58f1a-c209-428e-814b-d973231ddcb6', operator: '==', value: 'on' },
              ],
            },
          ],
        }, true);
        const conditions = parsedObj.get('conditions');
        const newState = state
          .setIn(['runtime', 'answers'], answers)
          .setIn(['survey', 'branches', 0, 'conditions'], conditions);
        const branch = newState.findBranch('805905f0-ef30-4a7c-949b-4f1e6f48f212');
        const result = branch.evaluateConditions(answers, newState.getAllOutputDefinitionMap());
        expect(result).toBe('N001');
      });

      it('operatorが==のときすべての条件が真でない場合nullが返ること', () => {
        const answers = new Map()
          .set('e27c61fa-6c32-4a10-893f-e280bc089b9d__value1', 'on')
          .set('e27c61fa-6c32-4a10-893f-e280bc089b9d__value2', '');
        const parsedObj = SurveyDesignerState.createFromJson({
          conditions: [
            {
              _id: 'C001',
              conditionType: 'all',
              nextNodeId: 'N001',
              childConditions: [
                { _id: 'CC001', outputId: 'b2c453ee-b3b1-47fd-8d52-cb693156f43c', operator: '==', value: 'on' },
                { _id: 'CC001', outputId: 'f7e58f1a-c209-428e-814b-d973231ddcb6', operator: '==', value: 'on' },
              ],
            },
          ],
        }, true);
        const conditions = parsedObj.get('conditions');
        const newState = state
          .setIn(['runtime', 'answers'], answers)
          .setIn(['survey', 'branches', 0, 'conditions'], conditions);
        const branch = newState.findBranch('805905f0-ef30-4a7c-949b-4f1e6f48f212');
        const result = branch.evaluateConditions(answers, newState.getAllOutputDefinitionMap());
        expect(result).toBe(null);
      });
    });

    describe('conditionTypeがsome', () => {
      it('operatorが==のときすべてのひとつ真があれば正しいnodeIdが返ること', () => {
        const answers = new Map()
          .set('e27c61fa-6c32-4a10-893f-e280bc089b9d__value1', 'on')
          .set('e27c61fa-6c32-4a10-893f-e280bc089b9d__value2', '');
        const parsedObj = SurveyDesignerState.createFromJson({
          conditions: [
            {
              _id: 'C001',
              conditionType: 'some',
              nextNodeId: 'N001',
              childConditions: [
                { _id: 'CC001', outputId: 'b2c453ee-b3b1-47fd-8d52-cb693156f43c', operator: '==', value: 'on' },
                { _id: 'CC001', outputId: 'f7e58f1a-c209-428e-814b-d973231ddcb6', operator: '==', value: 'on' },
              ],
            },
          ],
        }, true);
        const conditions = parsedObj.get('conditions');
        const newState = state
          .setIn(['runtime', 'answers'], answers)
          .setIn(['survey', 'branches', 0, 'conditions'], conditions);
        const branch = newState.findBranch('805905f0-ef30-4a7c-949b-4f1e6f48f212');
        const result = branch.evaluateConditions(answers, newState.getAllOutputDefinitionMap());
        expect(result).toBe('N001');
      });

      it('operatorが==のとき一つも条件が真でない場合nullが返ること', () => {
        const answers = new Map()
          .set('e27c61fa-6c32-4a10-893f-e280bc089b9d__value1', '')
          .set('e27c61fa-6c32-4a10-893f-e280bc089b9d__value2', '');
        const parsedObj = SurveyDesignerState.createFromJson({
          conditions: [
            {
              _id: 'C001',
              conditionType: 'some',
              nextNodeId: 'N001',
              childConditions: [
                { _id: 'CC001', outputId: 'b2c453ee-b3b1-47fd-8d52-cb693156f43c', operator: '==', value: 'on' },
                { _id: 'CC001', outputId: 'f7e58f1a-c209-428e-814b-d973231ddcb6', operator: '==', value: 'on' },
              ],
            },
          ],
        }, true);
        const conditions = parsedObj.get('conditions');
        const newState = state
          .setIn(['runtime', 'answers'], answers)
          .setIn(['survey', 'branches', 0, 'conditions'], conditions);
        const branch = newState.findBranch('805905f0-ef30-4a7c-949b-4f1e6f48f212');
        const result = branch.evaluateConditions(answers, newState.getAllOutputDefinitionMap());
        expect(result).toBe(null);
      });
    });
  });
});
