/* eslint-env jest */
import { Map } from 'immutable';
import SurveyDesignerState from '../../../../../../lib/runtime/models/SurveyDesignerState';
import OutputDefinition from '../../../../../../lib/runtime/models/survey/questions/internal/OutputDefinition';

describe('OutputDefinition', () => {
  describe('isOutputTypeSingleChoice', () => {
    function testIsOutputTypeSingleChoice(outputType, expectResult) {
      expect(new OutputDefinition({ outputType }).isOutputTypeSingleChoice()).toBe(expectResult);
    }
    it('radioの場合trueを返す', () => {
      testIsOutputTypeSingleChoice('radio', true)
    });
    it('selectの場合trueを返す', () => {
      testIsOutputTypeSingleChoice('select', true)
    });
    it('textの場合falseを返す', () => {
      testIsOutputTypeSingleChoice('text', false)
    });
    it('numberの場合falseを返す', () => {
      testIsOutputTypeSingleChoice('number', false)
    });
    it('checkboxの場合falseを返す', () => {
      testIsOutputTypeSingleChoice('checkbox', false)
    });
  });
});
