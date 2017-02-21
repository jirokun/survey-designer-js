import * as Utils from '../utils';

export function validateQuestionId(page, currentQuestionId, newQuestionId) {
  if (Utils.isEmpty(newQuestionId)) return false;
  if (currentQuestionId === newQuestionId) return true;
  return !page.questions.find(q => q.id === newQuestionId);
}
