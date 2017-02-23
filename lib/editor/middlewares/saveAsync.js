import debounce from 'throttle-debounce/debounce';
import * as Actions from '../actions';
import * as C from '../../constants/constants';

const debouncedSaveAsync = debounce(3000, (dispatch, saveSurveyUrl, newSurvey) => {
  console.log(JSON.stringify(newSurvey.toJS()));
  if (!saveSurveyUrl) return;
  Actions.saveSurvey(dispatch, saveSurveyUrl, newSurvey);
});

/** surveyの定義が変わった際にサーバにsurveyを保存するmiddleware */
export default store => next => (action) => {
  const oldSurvey = store.getState().getSurvey();
  next(action);
  const newSurvey = store.getState().getSurvey();
  if (oldSurvey === newSurvey) return;
  store.dispatch(Actions.changeSaveSurveyStatus(C.SURVEY_NOT_POSTED));
  const saveSurveyUrl = store.getState().getOptions().getSaveSurveyUrl();
  debouncedSaveAsync(store.dispatch, saveSurveyUrl, newSurvey);
};
