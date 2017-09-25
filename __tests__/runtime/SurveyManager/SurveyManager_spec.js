/* eslint-env jest */
import SurveyDesignerState from '../../../lib/runtime/models/SurveyDesignerState';
import SurveyManager from '../../../lib/runtime/SurveyManager';
import baseJson from './base.json';

describe('SurveyManager', () => {
  it('devId => name に変換できる', () => {
    const survey = SurveyDesignerState.createFromJson(baseJson).getSurvey();
    const surveyManager = new SurveyManager(survey, {});
    expect(surveyManager.getNameByDevId('ww1_xx1_yy1')).toBe('1__value1');
    expect(surveyManager.getNameByDevId('ww1_xx1_yy2')).toBe('1__value2');
    expect(surveyManager.getNameByDevId('ww1_xx1_yy3')).toBe('1__value3');
    expect(surveyManager.getNameByDevId('ww1_xx2_yy4')).toBe('2__value1');
    expect(surveyManager.getNameByDevId('ww1_xx2_yy5')).toBe('2__value2');
  });
});
