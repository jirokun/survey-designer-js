/**
 * 日程質問に関する制限の定義がv1.8以前とv1.9以降で異なる。
 * v1.8以前に作られた定義のものはこのメソッドでv1.9以降の定義に自動的に置き換える
 *
 * v1.8以前
 * 日程質問にSubItemsがなくデフォルト表示
 *
 * v1.9以降
 * 日程質問にSubItemsがあり、可変(初期値はデフォルト値)
 */
export function migrateScheduleSubItems(survey) {
  let tmpSurvey = survey;

  const shouldMigrate = (question) => {
    if (!question.getSubItems() || question.getSubItems().size === 0) { return true; }
    return question.getSubItems().size === 1 && question.getSubItems().get(0).getLabel() === '名称未設定';
  };

  survey.getPages().forEach((page, pageIndex) => {
    page.getQuestions().forEach((question, questionIndex) => {
      if (question.dataType === 'Schedule' && shouldMigrate(question)) {
        tmpSurvey = tmpSurvey.updateIn(['pages', pageIndex, 'questions', questionIndex], q => q.updateDefaultSubItems());
      }
    });
  });

  return tmpSurvey;
}
