import debounce from 'throttle-debounce/debounce';
import * as Actions from '../actions';
import { SURVEY_NOT_POSTED } from '../../constants/states';

/** 一定時間変更がなかった場合にだけ実際にsaveを行う関数 */
const debouncedSaveAsync = debounce(1500, (dispatch, saveSurveyUrl, newSurvey) => {
  // console.log(JSON.stringify(newSurvey.toJS()));
  if (!saveSurveyUrl) return;
  Actions.saveSurvey(dispatch, saveSurveyUrl, newSurvey);
});

/** surveyの定義が変わった際にサーバにsurveyを保存するmiddleware */
export default store => next => (action) => {
  const oldSurvey = store.getState().getSurvey();
  next(action);
  const newSurvey = store.getState().getSurvey();
  console.log(JSON.stringify(newSurvey, null, 2));
  if (oldSurvey === newSurvey) return;
  store.dispatch(Actions.changeSaveSurveyStatus(SURVEY_NOT_POSTED));
  const saveSurveyUrl = store.getState().getOptions().getSaveSurveyUrl();
  debouncedSaveAsync(store.dispatch, saveSurveyUrl, newSurvey);
};
