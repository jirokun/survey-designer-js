import React from 'react';
import { mount } from 'enzyme';
import CheckboxQuestion from '../../../../lib/runtime/components/questions/CheckboxQuestion';
import Options from '../../../../lib/runtime/models/options/Options';
import SurveyDefinition from '../../../../lib/runtime/models/survey/SurveyDefinition';
import Page from '../../../../lib/runtime/components/Page';
import ChoiceQuestionBase from '../../../../lib/runtime/components/questions/ChoiceQuestionBase';
import RuntimeValue from '../../../../lib/runtime/models/runtime/RuntimeValue';

function prepareSurvey(callback) {
  const survey = new SurveyDefinition().addNode(0, 'page');
  survey.refreshReplacer();
  const replacer = survey.getReplacer();

  return survey.updateIn(['pages', 0], (page) => {
    const newPage = page.addQuestion('Checkbox', page.getId(), 0);
    const questionId = newPage.getQuestions().get(0).getId();
    return callback(replacer, newPage, questionId);
  });
}

function mountPage(survey, QuestionClass) {
  survey.refreshReplacer();
  const replacer = survey.getReplacer();
  const page = survey.getPages().get(0);
  const question = page.getQuestions().get(0);

  const options = new Options();
  return mount(<Page page={page} survey={survey} options={options} runtime={new RuntimeValue()} nextPage={() => {}} />, { attachTo: document.body });
}

describe('<CheckboxQuestion />', () => {
  it('itemの数だけCheckboxが表示される', () => {
    const survey = prepareSurvey((replacer, page, questionId) => {
      return page
        .addItem(questionId, 0)
        .addItem(questionId, 0)
        .updateQuestionAttribute(questionId, 'description', '補足です', '補足です', replacer)
        .setIn(['questions', 0, 'items', 0, 'label'], '選択肢1')
        .setIn(['questions', 0, 'items', 1, 'label'], '選択肢2')
        .setIn(['questions', 0, 'items', 2, 'label'], '選択肢3');
    });
    const pageEl = mountPage(survey, CheckboxQuestion);

    expect(pageEl.find('h2.question-title').text()).toBe('設問タイトル');
    expect(pageEl.find('ul').length).toBe(1);
    expect(pageEl.find('ul').hasClass('validation-hover-target')).toBe(true);
    expect(pageEl.find('ul').prop('id')).toBe(ChoiceQuestionBase.getContainerId(survey.getIn(['pages', 0, 'questions', 0])));
    expect(pageEl.find('Item').length).toBe(3);
    console.log(pageEl.html());
  });

  it('randomの場合ランダム表示される', () => {
    const survey = prepareSurvey((replacer, page, questionId) => {
      return page
        .addItem(questionId, 0)
        .addItem(questionId, 0)
        .addItem(questionId, 0)
        .updateQuestionAttribute(questionId, 'description', '補足です', '補足です', replacer)
        .updateQuestionAttribute(questionId, 'random', true, true, replacer)
        .setIn(['questions', 0, 'items', 0, 'label'], '選択肢1')
        .setIn(['questions', 0, 'items', 1, 'label'], '選択肢2')
        .setIn(['questions', 0, 'items', 2, 'label'], '選択肢3')
        .setIn(['questions', 0, 'items', 3, 'label'], '選択肢4');
    });
    const pageEl = mountPage(survey, CheckboxQuestion);

    expect(pageEl.find('h2.question-title').text()).toBe('設問タイトル');
    expect(pageEl.find('ul').length).toBe(1);
    expect(pageEl.find('ul').hasClass('validation-hover-target')).toBe(true);
    expect(pageEl.find('ul').prop('id')).toBe(ChoiceQuestionBase.getContainerId(survey.getIn(['pages', 0, 'questions', 0])));
    expect(pageEl.find('Item').length).toBe(4);
    console.log(pageEl.html());
  });

});
