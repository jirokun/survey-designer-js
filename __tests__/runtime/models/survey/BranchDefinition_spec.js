/* eslint-env jest */
import { Map } from 'immutable';
import SurveyDesignerState from '../../../../lib/runtime/models/SurveyDesignerState';
import sample from './BranchDefinition.json';
import sample2 from './BranchDefinition2.json';

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
        const newSurvey = newState.getSurvey();
        const branch = newSurvey.findBranch('805905f0-ef30-4a7c-949b-4f1e6f48f212');
        const result = branch.evaluateConditions(answers, newSurvey.getAllOutputDefinitionMap(), newSurvey.updateReplacer(answers));
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
        const newSurvey = newState.getSurvey();
        const branch = newSurvey.findBranch('805905f0-ef30-4a7c-949b-4f1e6f48f212');
        const result = branch.evaluateConditions(answers, newSurvey.getAllOutputDefinitionMap(), newSurvey.updateReplacer(answers));
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
        const newSurvey = newState.getSurvey();
        const branch = newSurvey.findBranch('805905f0-ef30-4a7c-949b-4f1e6f48f212');
        const result = branch.evaluateConditions(answers, newSurvey.getAllOutputDefinitionMap(), newSurvey.updateReplacer(answers));
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
        const newSurvey = newState.getSurvey();
        const branch = newSurvey.findBranch('805905f0-ef30-4a7c-949b-4f1e6f48f212');
        const result = branch.evaluateConditions(answers, newSurvey.getAllOutputDefinitionMap(), newSurvey.updateReplacer(answers));
        expect(result).toBe(null);
      });
    });

    describe('数値の比較', () => {
      function exec(operator, expectedResult) {
        const answers = new Map()
          .set('e27c61fa-6c32-4a10-893f-e280bc089b9d__value1', '10');
        const parsedObj = SurveyDesignerState.createFromJson({
          conditions: [
            {
              _id: 'C001',
              conditionType: 'all',
              nextNodeId: 'N001',
              childConditions: [
                { _id: 'CC001', outputId: 'b2c453ee-b3b1-47fd-8d52-cb693156f43c', operator, value: '2' },
              ],
            },
          ],
        }, true);
        const conditions = parsedObj.get('conditions');
        const newState = state
          .setIn(['runtime', 'answers'], answers)
          .setIn(['survey', 'branches', 0, 'conditions'], conditions);
        const newSurvey = newState.getSurvey();
        const branch = newSurvey.findBranch('805905f0-ef30-4a7c-949b-4f1e6f48f212');
        const result = branch.evaluateConditions(answers, newSurvey.getAllOutputDefinitionMap(), newSurvey.updateReplacer(answers));
        expect(result).toBe(expectedResult);
      }

      it('operatorが>の場合、大小関係の場合には数値表現として比較される', () => exec('>', 'N001'));
      it('operatorが>=の場合、大小関係の場合には数値表現として比較される', () => exec('>=', 'N001'));
      it('operatorが<の場合、大小関係の場合には数値表現として比較される', () => exec('<', null));
      it('operatorが<=の場合、大小関係の場合には数値表現として比較される', () => exec('<=', null));

      it('空文字との比較のときはnullが返ること', () => {
        const answers = new Map()
          .set('e27c61fa-6c32-4a10-893f-e280bc089b9d__value1', '');
        const parsedObj = SurveyDesignerState.createFromJson({
          conditions: [
            {
              _id: 'C001',
              conditionType: 'all',
              nextNodeId: 'N001',
              childConditions: [
                { _id: 'CC001', outputId: 'b2c453ee-b3b1-47fd-8d52-cb693156f43c', operator: '>', value: '2' },
              ],
            },
          ],
        }, true);
        const conditions = parsedObj.get('conditions');
        const newState = state
          .setIn(['runtime', 'answers'], answers)
          .setIn(['survey', 'branches', 0, 'conditions'], conditions);
        const newSurvey = newState.getSurvey();
        const branch = newSurvey.findBranch('805905f0-ef30-4a7c-949b-4f1e6f48f212');
        const result = branch.evaluateConditions(answers, newSurvey.getAllOutputDefinitionMap(), newSurvey.updateReplacer(answers));
        expect(result).toBe(null);
      });
    });
  });


  describe('updateConditionAttribute', () => {
    it('conditionの属性を更新できる', () => {
      const result = state.getSurvey().findBranch('805905f0-ef30-4a7c-949b-4f1e6f48f212').updateConditionAttribute('f538b3df-ecd7-486e-921c-a2a497ee9d09', 'conditionType', 'some');
      expect(result.getIn(['conditions', 0, 'conditionType'])).toBe('some');
    });
  });

  describe('updateChildConditionAttribute', () => {
    it('childConditionの属性を更新できる', () => {
      const result = state.getSurvey().findBranch('805905f0-ef30-4a7c-949b-4f1e6f48f212')
        .updateChildConditionAttribute('f538b3df-ecd7-486e-921c-a2a497ee9d09', '57ea60ac-a7c9-48c8-a552-eb4940f7060c', 'operator', '!=');
      expect(result.getIn(['conditions', 0, 'childConditions', 0, 'operator'])).toBe('!=');
    });
  });

  describe('swapCondition', () => {
    it('指定したconditionを入れ替えることができる', () => {
      const result = state.getSurvey().findBranch('805905f0-ef30-4a7c-949b-4f1e6f48f212').swapCondition('f538b3df-ecd7-486e-921c-a2a497ee9d09', '7ee06f54-71f1-4dd1-9643-6d4ae91b3fc6');
      expect(result.getIn(['conditions', 0, 'nextNodeId'])).toBe('09d5a018-45d1-4dc4-9d72-34a33a1475de');
      expect(result.getIn(['conditions', 1, 'nextNodeId'])).toBe('dce07ee5-fa63-4a74-a81d-fa117ed62ada');
    });
  });

  describe('validate', () => {
    it('遷移先の参照が存在しない', () => {
      const survey = state.getSurvey().setIn(['branches', 0, 'conditions', 0, 'nextNodeId'], '');
      const branch = survey.getIn(['branches', 0]);
      const result = branch.validate(survey);
      expect(result.size).toBe(1);
      expect(result.get(0)).toBe('分岐設定の遷移先が存在しません');
    });
    it('条件の設問が存在しない', () => {
      const survey = state.getSurvey().setIn(['branches', 0, 'conditions', 0, 'childConditions', 0, 'outputId'], '');
      const branch = survey.getIn(['branches', 0]);
      const result = branch.validate(survey);
      expect(result.size).toBe(1);
      expect(result.get(0)).toBe('設定されていない分岐条件があります');
    });
    it('数値条件の値が未入力', () => {
      const survey = state.getSurvey()
        .setIn(['branches', 0, 'conditions', 0, 'childConditions', 0, 'outputId'], 'b6ad6c40-431d-432f-93c6-5270c421b609')
        .setIn(['branches', 0, 'conditions', 0, 'childConditions', 0, 'value'], '');
      const branch = survey.getIn(['branches', 0]);
      const result = branch.validate(survey);
      expect(result.size).toBe(1);
      expect(result.get(0)).toBe('分岐条件の入力値が空欄です');
    });
    it('条件の選択値(radio)が未入力', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: sample2 }).getSurvey();
      const branch = survey.getIn(['branches', 0]);
      const result = branch.validate(survey);
      expect(result.size).toBe(1);
      expect(result.get(0)).toBe('分岐条件の入力値が選択されていません');
    });
  });
});
