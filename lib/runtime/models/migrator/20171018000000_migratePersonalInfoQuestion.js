/**
 * PersonalInfoQuestionのItemsを定義する
 *
 * 修正前
 * Itemsが存在しない
 *
 * 修正後
 * Itemsが定義される
 */
export function migratePersonalInfoQuestion(survey) {
  let tmpSurvey = survey;

  const shouldMigrate = (question) => {
    if (!question.getItems() || question.getItems().size === 0) { return true; }
    return question.getItems().size === 1 && question.getItems().get(0).getLabel() === '名称未設定';
  };

  survey.getPages().forEach((page, pageIndex) => {
    page.getQuestions().forEach((question, questionIndex) => {
      if (question.dataType === 'PersonalInfo' && shouldMigrate(question)) {
        tmpSurvey = tmpSurvey.updateIn(['pages', pageIndex, 'questions', questionIndex], q => q.updateDefaultItems());
      }
    });
  });

  return tmpSurvey;
}
