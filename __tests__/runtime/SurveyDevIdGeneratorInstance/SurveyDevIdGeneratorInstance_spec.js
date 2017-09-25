/* eslint-env jest */
import SurveyDesignerState from '../../../lib/runtime/models/SurveyDesignerState';
import { SurveyDevIdGenerator } from '../../../lib/runtime/SurveyDevIdGenerator';
import baseJson from './base.json';

class SurveyDevIdGeneratorTest extends SurveyDevIdGenerator {
  getExistIds() {
    return this.existIds;
  }
}

describe('SurveyDevIdGenerator', () => {
  let surveyDevIdGeneratorTest;
  beforeEach(() => {
    const survey = SurveyDesignerState.createFromJson(baseJson).getSurvey();
    surveyDevIdGeneratorTest = new SurveyDevIdGeneratorTest();
    surveyDevIdGeneratorTest.updateExistingIds(survey);
  });

  describe('firePageLoad', () => {
    it('既存のsurveyからdevIdを生成できる', () => {
      const existIds = surveyDevIdGeneratorTest.getExistIds();
      expect(existIds.toArray()).toEqual(['ww1', 'ww2', 'xx1', 'xx2', 'xx3', 'yy1', 'yy2', 'yy3', 'yy4', 'yy5', 'yy6']);
    });

    it('Page用のdev-idを生成できる', () => {
      const pageDevId = surveyDevIdGeneratorTest.generateForPage();
      expect(['ww1', 'ww2', 'xx1', 'xx2', 'xx3', 'yy1', 'yy2', 'yy3', 'yy4', 'yy5', 'yy6'].includes(pageDevId)).toBeFalsy();

      const existIds = surveyDevIdGeneratorTest.getExistIds();
      expect(existIds.toArray()).toEqual(['ww1', 'ww2', 'xx1', 'xx2', 'xx3', 'yy1', 'yy2', 'yy3', 'yy4', 'yy5', 'yy6', pageDevId]);
    });

    it('Question用のdev-idを生成できる', () => {
      const questionDevId = surveyDevIdGeneratorTest.generateForQuestion('ww1');
      expect(questionDevId.startsWith('ww1_')).toBeTruthy();

      const uniqDevId = questionDevId.split('_').slice(-1)[0];
      expect(['ww1', 'ww2', 'xx1', 'xx2', 'xx3', 'yy1', 'yy2', 'yy3', 'yy4', 'yy5', 'yy6'].includes(uniqDevId)).toBeFalsy();

      const existIds = surveyDevIdGeneratorTest.getExistIds();
      expect(existIds.toArray()).toEqual(['ww1', 'ww2', 'xx1', 'xx2', 'xx3', 'yy1', 'yy2', 'yy3', 'yy4', 'yy5', 'yy6', uniqDevId]);
    });

    it('Item用のdev-idを生成できる', () => {
      const itemDevId = surveyDevIdGeneratorTest.generateForItem('ww1_xx1');
      expect(itemDevId.startsWith('ww1_xx1_')).toBeTruthy();

      const uniqDevId = itemDevId.split('_').slice(-1)[0];
      expect(['ww1', 'ww2', 'xx1', 'xx2', 'xx3', 'yy1', 'yy2', 'yy3', 'yy4', 'yy5', 'yy6'].includes(uniqDevId)).toBeFalsy();

      const existIds = surveyDevIdGeneratorTest.getExistIds();
      expect(existIds.toArray()).toEqual(['ww1', 'ww2', 'xx1', 'xx2', 'xx3', 'yy1', 'yy2', 'yy3', 'yy4', 'yy5', 'yy6', uniqDevId]);
    });

    it('ユニークなidが生成される', () => {
      const initArr = ['ww1', 'ww2', 'xx1', 'xx2', 'xx3', 'yy1', 'yy2', 'yy3', 'yy4', 'yy5', 'yy6'];
      for (let i = 1; i < 1000; i++) {
        const newId = surveyDevIdGeneratorTest.getUniqStr();
        expect(initArr.includes(newId)).toBeFalsy();
        const existIds = surveyDevIdGeneratorTest.getExistIds();
        expect(Array.from(new Set(existIds)).length).toEqual(initArr.length + i);
      }
    });

    it('3文字のidが生成される', () => {
      const newId = surveyDevIdGeneratorTest.generateIdStr();
      expect(newId.length).toBe(3);
    });
  });
});
