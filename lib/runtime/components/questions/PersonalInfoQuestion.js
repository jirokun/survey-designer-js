import React, { Component } from 'react';
import S from 'string';
import { r } from '../../../utils';
import PREFECTURES from '../../../constants/prefectures';

export default class PersonalInfoQuestion extends Component {
  render() {
    const { question } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const answers = {};
    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        {S(title).isEmpty() ? null : <h2 className="question-title" dangerouslySetInnerHTML={{ __html: r(title, answers) }} />}
        {S(description).isEmpty() ?
          null : <h3 className="question-description" dangerouslySetInnerHTML={{ __html: r(description, answers) }} />}
        <div className="question">
          <table className="personalInfo question-form-grid-table">
            <tbody>
              <tr>
                <td>氏名</td>
                <td>
                  <label>
                    <input type="text" name={`${question.getId()}_name`} id={`${question.getId()}_name`} data-parsley-required />
                  </label>
                </td>
              </tr>
              <tr>
                <td>フリガナ</td>
                <td>
                  <label>
                    <input
                      type="text"
                      name={`${question.getId()}_furigana`}
                      id={`${question.getId()}_furigana`}
                      data-parsley-required
                      data-parsley-pattern="[ア-ンー～]+"
                      data-parsley-pattern-message="カタカナで入力してください"
                    />
                  </label>
                </td>
              </tr>
              <tr>
                <td>病院名（施設名）</td>
                <td>
                  <label>
                    <input type="text" name={`${question.getId()}_hospitalName`} id={`${question.getId()}_hospitalName`} data-parsley-required />
                  </label>
                </td>
              </tr>
              <tr>
                <td>病院所在地</td>
                <td>
                  <select name={`${question.getId()}_hospitalPrefecture`} id={`${question.getId()}_hospitalPrefecture`} style={{ width: '10em' }} data-parsley-required>
                    <option value="">▽</option>
                    {PREFECTURES.map(p => <option key={`${question.getId()}_hospitalPrefecture_${p}`} value={p}>{p}</option>)}
                  </select>
                </td>
              </tr>
              <tr>
                <td>診療科</td>
                <td>
                  <label>
                    <input type="text" name={`${question.getId()}_specialty`} id={`${question.getId()}_specialty`} data-parsley-required />
                  </label>
                </td>
              </tr>
              <tr>
                <td>役職名</td>
                <td>
                  <label>
                    <input type="text" name={`${question.getId()}_position`} id={`${question.getId()}_position`} />
                    <span>※任意でご記入ください。</span><
                  /label>
                </td>
              </tr>
              <tr>
                <td>年齢</td>
                <td>
                  <label>
                    <input type="number" name={`${question.getId()}_age`} id={`${question.getId()}_age`} style={{ width: '5em' }} data-parsley-required />
                  </label>
                </td>
              </tr>
              <tr>
                <td>性別</td>
                <td>
                  <select name={`${question.getId()}_sex`} id={`${question.getId()}_sex`} style={{ width: '10em' }} data-parsley-required>
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
                      name={`${question.getId()}_mobileTel`}
                      id={`${question.getId()}_mobileTel`}
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
                      name={`${question.getId()}_homeTel`}
                      id={`${question.getId()}_homeTel`}
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
                    <input type="text" name={`${question.getId()}_workTel`} id={`${question.getId()}_workTel`} data-parsley-required />
                  </label>
                </td>
              </tr>
              <tr>
                <td>Eメール</td>
                <td>
                  <label>
                    <input type="email" name={`${question.getId()}_email`} id={`${question.getId()}_email`} data-parsley-required />
                  </label>
                </td>
              </tr>
              <tr>
                <td>日程調整</td>
                <td>
                  <div id={`${question.getId()}_scheduleContactDiv`}>
                    ご都合のよろしいご連絡先<br />
                    <b>※可能であればお電話でもご連絡させていただきたく、電話番号のうち、出来るだけどちらか一つはお選びください。</b>
                    <label className="personalInfo-label">
                      <input
                        name={`${question.getId()}_scheduleContact1`}
                        id={`${question.getId()}_scheduleContact1`}
                        type="checkbox"
                        value="1"
                        data-parsley-class-handler={`#${question.getId()}_scheduleContactDiv`}
                        data-parsley-required
                      />
                      <span>携帯電話</span>
                    </label>
                    <label id={`${question.getId()}_scheduleContact_label`} className="personalInfo-label personalInfo-label-disabled">
                      <input
                        name={`${question.getId()}_scheduleContact2`}
                        disabled="disabled"
                        id={`${question.getId()}_scheduleContact2`}
                        type="checkbox"
                        value="1"
                        data-parsley-class-handler={`#${question.getId()}_scheduleContactDiv`}
                        data-parsley-required
                      />
                      <span id={`${question.getId()}_scheduleContact2_text`} className="disabled">TEL（自宅）</span>
                    </label>
                    <label className="personalInfo-label">
                      <input
                        name={`${question.getId()}_scheduleContact3`}
                        id={`${question.getId()}_scheduleContact3`}
                        type="checkbox"
                        value="1"
                        data-parsley-class-handler={`#${question.getId()}_scheduleContactDiv`}
                        data-parsley-required
                      />
                      <span>TEL（勤務先）</span>
                    </label>
                    <label className="personalInfo-label">
                      <input
                        name={`${question.getId()}_scheduleContact4`}
                        id={`${question.getId()}_scheduleContact4`}
                        type="checkbox"
                        value="1"
                        data-parsley-class-handler={`#${question.getId()}_scheduleContactDiv`}
                        data-parsley-required
                      />
                      <span>Eメール</span>
                    </label>
                  </div>
                  <div style={{ paddingTop: '1em' }}>
                    ご連絡のつきやすい時間帯（平日）<br />
                    <label>
                      <input type="text" name={`${question.getId()}_contactTimeWeekday`} id={`${question.getId()}_contactTimeWeekday`} data-parsley-required />
                    </label>
                  </div>
                  <div style={{ paddingTop: '1em' }}>
                    ご連絡のつきやすい時間帯（休日）<br />
                    <label>
                      <input type="text" name={`${question.getId()}_contactTimeWeekend`} id={`${question.getId()}_contactTimeWeekend`} />
                      <span>※任意でご記入ください。</span>
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>インタビュー</td>
                <td>
                  <div id={`${question.getId()}_interviewContactDiv`}>
                    ご都合のよろしいご連絡先<br />
                    <label className="personalInfo-label">
                      <input
                        name={`${question.getId()}_interviewContact1`}
                        id={`${question.getId()}_interviewContact1`}
                        type="checkbox"
                        value="1"
                        data-parsley-class-handler={`#${question.getId()}_interviewContactDiv`}
                        data-parsley-required
                      />
                      <span>携帯電話</span>
                    </label>
                    <label id={`${question.getId()}_interviewContact_label`} className="personalInfo-label personalInfo-label-disabled">
                      <input
                        name={`${question.getId()}_interviewContact2`}
                        disabled="disabled"
                        id={`${question.getId()}_interviewContact2`}
                        type="checkbox"
                        value="1"
                        data-parsley-class-handler={`#${question.getId()}_interviewContactDiv`}
                        data-parsley-required
                      />
                      <span id={`${question.getId()}_interviewContact2_text`} className="disabled">TEL（自宅）</span>
                    </label>
                    <label className="personalInfo-label">
                      <input
                        name={`${question.getId()}_interviewContact3`}
                        id={`${question.getId()}_interviewContact3`}
                        type="checkbox"
                        value="1"
                        data-parsley-class-handler={`#${question.getId()}_interviewContactDiv`}
                        data-parsley-required
                      />
                      <span>TEL（勤務先）</span>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
