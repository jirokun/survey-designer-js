import S from 'string';

/** OutputDefinition毎にループしfuncを呼び出す */
function eachOutputDefinition(survey, page, question, func) {
  let tmpSurvey = survey;
  const pageNo = tmpSurvey.calcPageNo(page.getId());
  const pageIndex = tmpSurvey.findPageIndex(page.getId());
  const questionIndex = page.findQuestionIndex(question.getId());

  const outputDefinitions = question.getOutputDefinitions(pageNo, tmpSurvey.calcQuestionNo(page.getId(), question.getId()));
  outputDefinitions.forEach((od) => {
    tmpSurvey = tmpSurvey.updateIn(['pages', pageIndex, 'questions', questionIndex], q => func(od, q));
  });
  return tmpSurvey;
}

/** MultiNumberのminをNumberValidation */
function migrateMultiNumberMin(survey, page, question) {
  return eachOutputDefinition(survey, page, question, (outputDefinition, eachQuestion) => {
    if (outputDefinition.getId().match(/^.+__total$/)) return eachQuestion; // 合計は対応外
    return eachQuestion.addNumberValidation(outputDefinition.getId(), { value: eachQuestion.getMin(), operator: '>=' });
  });
}

function migrateMultiNumberMax(survey, page, question) {
  return eachOutputDefinition(survey, page, question, (outputDefinition, eachQuestion) => {
    if (outputDefinition.getId().match(/^.+__total$/)) return eachQuestion; // 合計は対応外
    return eachQuestion.addNumberValidation(outputDefinition.getId(), { value: eachQuestion.getMax(), operator: '<=' });
  });
}

function migrateMultiNumberTotalEqualTo(survey, page, question) {
  const pageNo = survey.calcPageNo(page.getId());
  const pageIndex = survey.findPageIndex(page.getId());
  const questionIndex = page.findQuestionIndex(question.getId());

  const outputDefinitions = question.getOutputDefinitions(pageNo, survey.calcQuestionNo(page.getId(), question.getId()));
  return survey.updateIn(['pages', pageIndex, 'questions', questionIndex], q =>
    q.addNumberValidation(outputDefinitions.last().getId(), { value: q.getTotalEqualTo(), operator: '==' }),
  );
}

function migrateMatrixNumberTotal(survey, page, question, type) {
  let tmpSurvey = survey;
  const pageNo = tmpSurvey.calcPageNo(page.getId());
  const questionNo = tmpSurvey.calcQuestionNo(page.getId());
  const pageIndex = tmpSurvey.findPageIndex(page.getId());
  const questionIndex = page.findQuestionIndex(question.getId());

  const sumRowsOutputDefinitions = question.getOutputDefinitionForSum(type, pageNo, questionNo);
  const items = type === 'rows' ? question.getItems() : question.getSubItems();

  sumRowsOutputDefinitions.forEach((od, index) => {
    const item = items.get(index);
    const totalEqualTo = item.getTotalEqualTo();
    if (S(totalEqualTo).isEmpty()) return;

    tmpSurvey = tmpSurvey.updateIn(['pages', pageIndex, 'questions', questionIndex], (q) => {
      return q.addNumberValidation(od.getId(), { value: totalEqualTo, operator: '==' });
    });
  });
  return tmpSurvey;
}

/**
 * 数値入力に関する制限の定義がv1.7以前とv1.8以降で異なる。
 * v1.7以前に作られた定義のものはこのメソッドでv1.8以降の定義に自動的に置き換える
 * 
 * v1.7以前
 * 数値入力
 *   * 最小値の定義: BaseQuestionDefinition.min
 *   * 最大値の定義: BaseQuestionDefinition.max
 *   * 合計の定義: BaseQuestionDefinition.totalEqualTo
 *
 * 表形式(数値)
 *   * 行の合計値: ItemDefinition.totalEqualTo
 *   * 列の合計値: ItemDefinition.totalEqualTo
 * 
 * v1.8以降
 * 全ての数値入力(OutputDefinition.dataType === 'number'): BaseQuestionDefinition.numberValidationRule
 */
export function migrateNumberValidation(survey) {
  let tmpSurvey = survey;
  // NumberValidationRuleMapが一つでもあれば、すでにmigrate済みとして扱いなにもしない
  if (survey.getPages().flatMap(page => page.getQuestions()).find(question => question.getNumberValidationRuleMap().size > 0)) return survey;

  survey.getPages().forEach((page) => {
    page.getQuestions().forEach((question) => {
      if (question.getDataType() === 'MultiNumber') { // 数値入力
        if (!S(question.getMin()).isEmpty()) tmpSurvey = migrateMultiNumberMin(tmpSurvey, page, question);
        if (!S(question.getMax()).isEmpty()) tmpSurvey = migrateMultiNumberMax(tmpSurvey, page, question);
        if (!S(question.getTotalEqualTo()).isEmpty()) tmpSurvey = migrateMultiNumberTotalEqualTo(tmpSurvey, page, question);
      } else if (question.getDataType() === 'Matrix' && question.matrixType === 'number') { // 表形式（数値）
        tmpSurvey = migrateMatrixNumberTotal(tmpSurvey, page, question, 'rows');
        tmpSurvey = migrateMatrixNumberTotal(tmpSurvey, page, question, 'columns');
      }
    });
  });
  return tmpSurvey;
}
