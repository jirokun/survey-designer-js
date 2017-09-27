/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import S from 'string';
import classNames from 'classnames';
import QuestionDetail from '../parts/QuestionDetail';
import PREFECTURES from '../../../constants/prefectures';
import * as FIELDS from '../../../constants/personalInfoFields';

/** 設問：個人情報 */
class PersonalInfoQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homeTelEmpty: true,              // TEL（自宅）が空かどうか
      scheduleContact2Checked: false,  // _scheduleContact2はcontroled
      interviewContact2Checked: false, // _interviewContact2はcontroled
    };
  }

  /** TEL（自宅）を編集したときのハンドラ */
  handleHomeTelChange(value) {
    const homeTelEmpty = S(value).isEmpty();
    const newState = {
      homeTelEmpty,
      scheduleContact2Checked: homeTelEmpty ? false : this.state.scheduleContact2Checked,
      interviewContact2Checked: homeTelEmpty ? false : this.state.interviewContact2Checked,
    };
    this.setState(newState);
  }

  handleScheduleContact2Change(checked) {
    this.setState({ scheduleContact2Checked: checked });
  }

  handleInterviewContact2Change(checked) {
    this.setState({ interviewContact2Checked: checked });
  }

  getOutputNo(name) {
    const { survey, question } = this.props;
    return survey.findOutputNoFromName(question.getOutputName(name));
  }

  render() {
    const { replacer, question, options } = this.props;
    const { homeTelEmpty } = this.state;
    const title = question.getTitle();
    const description = question.getDescription();
    const scheduleContactCheckboxGroup = `${question.getId()}_scheduleContact`;
    const interviewContactCheckboxGroup = `${question.getId()}_interviewContact`;
    const scheduleContactContainer = `${question.getId()}_scheduleContactContainer`;
    const interviewContactContainer = `${question.getId()}_interviewContactContainer`;
    const answers = {};

    return (
      <div className={this.constructor.name}>
        {S(title).isEmpty() ? null : <h2 className="question-title" data-dev-id-label={question.getDevId()} dangerouslySetInnerHTML={{ __html: replacer.id2Span(title, answers) }} />}
        {S(description).isEmpty() ?
          null : <h3 className="question-description" dangerouslySetInnerHTML={{ __html: replacer.id2Span(description, answers) }} />}
        <div className="question">
          <table className="personalInfo question-form-grid-table">
            <tbody>
              <tr>
                <td>氏名</td>
                <td>
                  <label>
                    <input
                      type="text"
                      name={question.getOutputName(FIELDS.name)}
                      id={question.getOutputName(FIELDS.name)}
                      data-output-no={this.getOutputNo(FIELDS.name)}
                      data-parsley-required
                    />
                  </label>
                </td>
              </tr>
              <tr>
                <td>フリガナ</td>
                <td>
                  <label>
                    <input
                      type="text"
                      name={question.getOutputName(FIELDS.furigana)}
                      id={question.getOutputName(FIELDS.furigana)}
                      data-output-no={this.getOutputNo(FIELDS.furigana)}
                      data-parsley-required
                      data-parsley-pattern="[ァ-ヶー～ 　]+"
                      data-parsley-pattern-message="カタカナで入力してください"
                    />
                  </label>
                </td>
              </tr>
              <tr>
                <td>病院名（施設名）</td>
                <td>
                  <label>
                    <input
                      type="text"
                      name={question.getOutputName(FIELDS.hospitalName)}
                      id={question.getOutputName(FIELDS.hospitalName)}
                      data-output-no={this.getOutputNo(FIELDS.hospitalName)}
                      data-parsley-required
                    />
                  </label>
                </td>
              </tr>
              <tr>
                <td>病院所在地</td>
                <td>
                  <select
                    name={question.getOutputName(FIELDS.hospitalPrefecture)}
                    id={question.getOutputName(FIELDS.hospitalPrefecture)}
                    style={{ width: '10em' }}
                    data-output-no={this.getOutputNo(FIELDS.hospitalPrefecture)}
                    data-parsley-required
                  >
                    <option value="">▽</option>
                    {PREFECTURES.map(p => <option key={`${question.getOutputName(FIELDS.hospitalPrefecture)}_${p}`} value={p}>{p}</option>)}
                  </select>
                </td>
              </tr>
              <tr>
                <td>診療科</td>
                <td>
                  <label>
                    <input
                      type="text"
                      name={question.getOutputName(FIELDS.specialty)}
                      id={question.getOutputName(FIELDS.specialty)}
                      data-output-no={this.getOutputNo(FIELDS.specialty)}
                      data-parsley-required
                    />
                  </label>
                </td>
              </tr>
              <tr>
                <td>役職名</td>
                <td>
                  <label>
                    <input
                      type="text"
                      name={question.getOutputName(FIELDS.position)}
                      id={question.getOutputName(FIELDS.position)}
                      data-output-no={this.getOutputNo(FIELDS.position)}
                    />
                    <span>※任意でご記入ください。</span>
                  </label>
                </td>
              </tr>
              <tr>
                <td>年齢</td>
                <td>
                  <label>
                    <input
                      type="text"
                      pattern="\d*"
                      maxLength="3"
                      name={question.getOutputName(FIELDS.age)}
                      id={question.getOutputName(FIELDS.age)}
                      style={{ width: '5em' }}
                      data-output-no={this.getOutputNo(FIELDS.age)}
                      data-parsley-required
                      data-parsley-positive-integer
                    />
                  </label>
                </td>
              </tr>
              <tr>
                <td>性別</td>
                <td>
                  <select
                    name={question.getOutputName(FIELDS.sex)}
                    id={question.getOutputName(FIELDS.sex)}
                    style={{ width: '10em' }}
                    data-output-no={this.getOutputNo(FIELDS.sex)}
                    data-parsley-required
                  >
                    <option value="">▽</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>携帯電話番号</td>
                <td>
                  <label>
                    <input
                      type="text"
                      name={question.getOutputName(FIELDS.mobileTel)}
                      id={question.getOutputName(FIELDS.mobileTel)}
                      data-output-no={this.getOutputNo(FIELDS.mobileTel)}
                      data-parsley-required
                      data-parsley-pattern="\(?\d+\)?\-?\d+\-?\d+"
                      data-parsley-pattern-message="正しい電話番号を入力してください"
                    />
                  </label>
                </td>
              </tr>
              <tr>
                <td>TEL（自宅）</td>
                <td>
                  <label>
                    <input
                      type="text"
                      name={question.getOutputName(FIELDS.homeTel)}
                      id={question.getOutputName(FIELDS.homeTel)}
                      onChange={e => this.handleHomeTelChange(e.target.value)}
                      data-output-no={this.getOutputNo(FIELDS.homeTel)}
                      data-parsley-pattern="\(?\d+\)?\-?\d+\-?\d+"
                      data-parsley-pattern-message="正しい電話番号を入力してください"
                    />
                    <span>※任意でご記入ください。</span>
                  </label>
                </td>
              </tr>
              <tr>
                <td>TEL（勤務先）</td>
                <td>
                  <label>
                    <input
                      type="text"
                      name={question.getOutputName(FIELDS.workTel)}
                      id={question.getOutputName(FIELDS.workTel)}
                      data-output-no={this.getOutputNo(FIELDS.workTel)}
                      data-parsley-required
                      data-parsley-pattern="\(?\d+\)?\-?\d+\-?\d+"
                      data-parsley-pattern-message="正しい電話番号を入力してください"
                    />
                  </label>
                </td>
              </tr>
              <tr>
                <td>Eメール</td>
                <td>
                  <label>
                    <input
                      type="email"
                      name={question.getOutputName(FIELDS.email)}
                      id={question.getOutputName(FIELDS.email)}
                      data-output-no={this.getOutputNo(FIELDS.email)}
                      data-parsley-required
                    />
                  </label>
                </td>
              </tr>
              <tr>
                <td>日程調整</td>
                <td>
                  <div id={scheduleContactContainer}>
                    ご都合のよろしいご連絡先<br />
                    <b>※可能であればお電話でもご連絡させていただきたく、電話番号のうち、出来るだけどちらか一つはお選びください。</b>
                    <label className="personalInfo-label">
                      <input
                        name={question.getOutputName(FIELDS.scheduleContact1)}
                        id={question.getOutputName(FIELDS.scheduleContact1)}
                        type="checkbox"
                        value="1"
                        data-output-no={this.getOutputNo(FIELDS.scheduleContact1)}
                        data-parsley-class-handler={`#${scheduleContactContainer}`}
                        data-parsley-required
                        data-parsley-multiple={scheduleContactCheckboxGroup}
                      />
                      <span className="select-tool check-not-text">携帯電話</span>
                    </label>
                    <label id={`${question.getId()}_scheduleContact_label`} className={classNames('personalInfo-label', { 'personalInfo-label-disabled': homeTelEmpty })}>
                      <input
                        name={question.getOutputName(FIELDS.scheduleContact2)}
                        disabled={homeTelEmpty}
                        id={question.getOutputName(FIELDS.scheduleContact2)}
                        type="checkbox"
                        value="1"
                        checked={this.state.scheduleContact2Checked}
                        onChange={e => this.handleScheduleContact2Change(e.target.checked)}
                        data-output-no={this.getOutputNo(FIELDS.scheduleContact2)}
                        data-parsley-class-handler={`#${scheduleContactContainer}`}
                        data-parsley-required
                        data-parsley-multiple={scheduleContactCheckboxGroup}
                      />
                      <span id={`${question.getId()}_scheduleContact2__text`} className={classNames('select-tool check-not-text', { disabled: homeTelEmpty })}>TEL（自宅）</span>
                    </label>
                    <label className="personalInfo-label">
                      <input
                        name={question.getOutputName(FIELDS.scheduleContact3)}
                        id={question.getOutputName(FIELDS.scheduleContact3)}
                        type="checkbox"
                        value="1"
                        data-output-no={this.getOutputNo(FIELDS.scheduleContact3)}
                        data-parsley-class-handler={`#${scheduleContactContainer}`}
                        data-parsley-required
                        data-parsley-multiple={scheduleContactCheckboxGroup}
                      />
                      <span className="select-tool check-not-text">TEL（勤務先）</span>
                    </label>
                    <label className="personalInfo-label">
                      <input
                        name={question.getOutputName(FIELDS.scheduleContact4)}
                        id={question.getOutputName(FIELDS.scheduleContact4)}
                        type="checkbox"
                        value="1"
                        data-output-no={this.getOutputNo(FIELDS.scheduleContact4)}
                        data-parsley-class-handler={`#${scheduleContactContainer}`}
                        data-parsley-required
                        data-parsley-multiple={scheduleContactCheckboxGroup}
                      />
                      <span className="select-tool check-not-text">Eメール</span>
                    </label>
                  </div>
                  <div style={{ paddingTop: '1em' }}>
                    ご連絡のつきやすい時間帯（平日）<br />
                    <label>
                      <input
                        type="text"
                        name={question.getOutputName(FIELDS.contactTimeWeekday)}
                        id={question.getOutputName(FIELDS.contactTimeWeekday)}
                        data-output-no={this.getOutputNo(FIELDS.contactTimeWeekday)}
                        data-parsley-required
                      />
                    </label>
                  </div>
                  <div style={{ paddingTop: '1em' }}>
                    ご連絡のつきやすい時間帯（休日）<br />
                    <label>
                      <input
                        type="text"
                        name={question.getOutputName(FIELDS.contactTimeWeekend)}
                        id={question.getOutputName(FIELDS.contactTimeWeekend)}
                        data-output-no={this.getOutputNo(FIELDS.contactTimeWeekend)}
                      />
                      <span>※任意でご記入ください。</span>
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>インタビュー</td>
                <td>
                  <div id={interviewContactContainer}>
                    ご都合のよろしいご連絡先<br />
                    <label className="personalInfo-label">
                      <input
                        name={question.getOutputName(FIELDS.interviewContact1)}
                        id={question.getOutputName(FIELDS.interviewContact1)}
                        type="checkbox"
                        value="1"
                        data-output-no={this.getOutputNo(FIELDS.interviewContact1)}
                        data-parsley-class-handler={`#${interviewContactContainer}`}
                        data-parsley-required
                        data-parsley-multiple={interviewContactCheckboxGroup}
                      />
                      <span className="select-tool check-not-text">携帯電話</span>
                    </label>
                    <label id={`${question.getId()}_interviewContact_label`} className={classNames('personalInfo-label', { 'personalInfo-label-disabled': homeTelEmpty })}>
                      <input
                        name={question.getOutputName(FIELDS.interviewContact2)}
                        disabled={homeTelEmpty}
                        id={question.getOutputName(FIELDS.interviewContact2)}
                        type="checkbox"
                        value="1"
                        checked={this.state.interviewContact2Checked}
                        onChange={e => this.handleInterviewContact2Change(e.target.checked)}
                        data-output-no={this.getOutputNo(FIELDS.interviewContact2)}
                        data-parsley-class-handler={`#${interviewContactContainer}`}
                        data-parsley-required
                        data-parsley-multiple={interviewContactCheckboxGroup}
                      />
                      <span id={`${question.getId()}_interviewContact2__text`} className={classNames('select-tool check-not-text', { disabled: homeTelEmpty })}>TEL（自宅）</span>
                    </label>
                    <label className="personalInfo-label">
                      <input
                        name={question.getOutputName(FIELDS.interviewContact3)}
                        id={question.getOutputName(FIELDS.interviewContact3)}
                        type="checkbox"
                        value="1"
                        data-output-no={this.getOutputNo(FIELDS.interviewContact3)}
                        data-parsley-class-handler={`#${interviewContactContainer}`}
                        data-parsley-required
                        data-parsley-multiple={interviewContactCheckboxGroup}
                      />
                      <span className="select-tool check-not-text">TEL（勤務先）</span>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        { options.isShowDetail() ? <QuestionDetail question={question} /> : null }
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
  options: state.getOptions(),
});

export default connect(
  stateToProps,
)(PersonalInfoQuestion);
