/* eslint-env browser */
import React from 'react';
import PREFECTURES from '../../../../constants/prefectures';
import * as FIELDS from '../../../../constants/personalInfoFields';
import classNames from 'classnames';

const getOutputNo = (survey, question, name) => {
  return survey.findOutputNoFromName(question.getOutputName(name));
};

const optionalLabel = () => <span className="question__personal-info__label_option">任意</span>;

export const AgeRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        <input
          type="text"
          pattern="\d*"
          maxLength="3"
          name={props.question.getOutputName(FIELDS.age)}
          id={props.question.getOutputName(FIELDS.age)}
          style={{ width: '5em' }}
          data-output-no={getOutputNo(props.survey, props.question, FIELDS.age)}
          data-parsley-required={props.item.isRequire()}
          data-parsley-positive-integer
        />
      </label>
    </td>
  </tr>);
};

export const BirthYearRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        <input
          type="text"
          pattern="\d*"
          maxLength="4"
          name={props.question.getOutputName(FIELDS.birthYear)}
          id={props.question.getOutputName(FIELDS.birthYear)}
          style={{ width: '5em' }}
          data-output-no={getOutputNo(props.survey, props.question, FIELDS.birthYear)}
          data-parsley-required={props.item.isRequire()}
          data-parsley-positive-integer
        />
      </label>
    </td>
  </tr>);
};

export const ContactEasyTimeRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        <input
          type="text"
          name={props.question.getOutputName(FIELDS.contactEasyTime)}
          id={props.question.getOutputName(FIELDS.contactEasyTime)}
          data-output-no={getOutputNo(props.survey, props.question, FIELDS.contactEasyTime)}
          data-parsley-required={props.item.isRequire()}
        />
      </label>
    </td>
  </tr>);
};

export const ContactMeansRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label className="question__personal-info__label-inline">
        <span className="question__personal-info__choice">
          <input
            type="checkbox"
            name={props.question.getOutputName(FIELDS.contactMeansTel)}
            id={props.question.getOutputName(FIELDS.contactMeansTel)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.contactMeansTel)}
            data-parsley-required={props.item.isRequire()}
          />電話
        </span>
      </label>
      <label className="question__personal-info__label-inline">
        <span className="question__personal-info__choice">
          <input
            type="checkbox"
            name={props.question.getOutputName(FIELDS.contactMeansEmail)}
            id={props.question.getOutputName(FIELDS.contactMeansEmail)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.contactMeansEmail)}
            data-parsley-required={props.item.isRequire()}
          />Eメール
        </span>
      </label>
    </td>
  </tr>);
};

export const EmailRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        <input
          type="email"
          name={props.question.getOutputName(FIELDS.email)}
          id={props.question.getOutputName(FIELDS.email)}
          data-output-no={getOutputNo(props.survey, props.question, FIELDS.email)}
          data-parsley-required={props.item.isRequire()}
        />
      </label>
    </td>
  </tr>);
};

export const FaxRow = (props) => {
  let inputContent;
  switch (props.item.getDisplayTypeId()) {
    case 'none':
      return null;
    case '3input':
      inputContent = (
        <span>
          <input
            type="text"
            className="question__personal-info__3input"
            name={props.question.getOutputName(FIELDS.fax1)}
            id={props.question.getOutputName(FIELDS.fax1)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.fax1)}
            pattern="\d+"
            maxLength="5"
            data-parsley-pattern-message="正しいFAX番号を入力してください"
            data-parsley-required={props.item.isRequire()}
          />
          <span className="question__personal-info__tel-splitter">
            -
          </span>
          <input
            type="text"
            className="question__personal-info__3input"
            name={props.question.getOutputName(FIELDS.fax2)}
            id={props.question.getOutputName(FIELDS.fax2)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.fax2)}
            pattern="\d+"
            maxLength="5"
            data-parsley-pattern-message="正しいFAX番号を入力してください"
            data-parsley-required={props.item.isRequire()}
          />
          <span className="question__personal-info__tel-splitter">
            -
          </span>
          <input
            type="text"
            className="question__personal-info__3input"
            name={props.question.getOutputName(FIELDS.fax3)}
            id={props.question.getOutputName(FIELDS.fax3)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.fax3)}
            pattern="\d+"
            maxLength="5"
            data-parsley-pattern-message="正しいFAX番号を入力してください"
            data-parsley-required={props.item.isRequire()}
          />
        </span>
      );
      break;
    default:
      inputContent = (<input
        type="text"
        className="js__personal-info__tel"
        name={props.question.getOutputName(FIELDS.fax)}
        id={props.question.getOutputName(FIELDS.fax)}
        data-output-no={getOutputNo(props.survey, props.question, FIELDS.fax)}
        data-parsley-pattern="\(?\d+\)?\-?\d+\-?\d+"
        data-parsley-pattern-message="正しいFAX番号を入力してください"
        data-parsley-required={props.item.isRequire()}
      />);
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        {inputContent}
      </label>
    </td>
  </tr>);
};

export const FuriganaRow = (props) => {
  let inputContent;
  switch (props.item.getDisplayTypeId()) {
    case 'none':
      return null;
    case '2input':
      const furiganaFirstField = props.item.getField(FIELDS.furiganaFirst);
      const furiganaLastField = props.item.getField(FIELDS.furiganaLast);
      inputContent = (
        <span>
          <input
            type="text"
            name={props.question.getOutputName(furiganaFirstField.getId())}
            id={props.question.getOutputName(furiganaFirstField.getId())}
            data-output-no={getOutputNo(props.survey, props.question, furiganaFirstField.getId())}
            data-parsley-pattern="[ァ-ヶー～ 　]+"
            data-parsley-pattern-message="カタカナで入力してください"
            className="question__personal-info__2input"
            placeholder="セイ"
            data-parsley-required={props.item.isRequire()}
          />
          <span className="question__personal-info__name-splitter" />
          <input
            type="text"
            name={props.question.getOutputName(furiganaLastField.getId())}
            id={props.question.getOutputName(furiganaLastField.getId())}
            data-output-no={getOutputNo(props.survey, props.question, furiganaLastField.getId())}
            data-parsley-pattern="[ァ-ヶー～ 　]+"
            data-parsley-pattern-message="カタカナで入力してください"
            className="question__personal-info__2input"
            placeholder="メイ"
            data-parsley-required={props.item.isRequire()}
          />
        </span>
      );
      break;
    default:
      const field = props.item.getField(FIELDS.furigana);
      inputContent = (<input
        type="text"
        name={props.question.getOutputName(field.getId())}
        id={props.question.getOutputName(field.getId())}
        data-output-no={getOutputNo(props.survey, props.question, field.getId())}
        data-parsley-required={props.item.isRequire()}
        data-parsley-pattern="[ァ-ヶー～ 　]+"
        data-parsley-pattern-message="カタカナで入力してください"
      />);
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        {inputContent}
      </label>
    </td>
  </tr>);
};

export const HospitalNameRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        <input
          type="text"
          name={props.question.getOutputName(FIELDS.hospitalName)}
          id={props.question.getOutputName(FIELDS.hospitalName)}
          data-output-no={getOutputNo(props.survey, props.question, FIELDS.hospitalName)}
          data-parsley-required={props.item.isRequire()}
        />
      </label>
    </td>
  </tr>);
};

export const HomeTelRow = (props) => {
  let inputContent;
  switch (props.item.getDisplayTypeId()) {
    case 'none':
      return null;
    case '3input':
      inputContent = (
        <span>
          <input
            type="text"
            className='question__personal-info__3input'
            name={props.question.getOutputName(FIELDS.homeTel1)}
            id={props.question.getOutputName(FIELDS.homeTel1)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.homeTel1)}
            pattern="\d+"
            maxLength="5"
            data-parsley-pattern-message="正しい電話番号を入力してください"
            data-parsley-required={props.item.isRequire()}
          />
          <span className="question__personal-info__tel-splitter">
            -
          </span>
          <input
            type="text"
            className='question__personal-info__3input'
            name={props.question.getOutputName(FIELDS.homeTel2)}
            id={props.question.getOutputName(FIELDS.homeTel2)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.homeTel2)}
            pattern="\d+"
            maxLength="5"
            data-parsley-pattern-message="正しい電話番号を入力してください"
            data-parsley-required={props.item.isRequire()}
          />
          <span className="question__personal-info__tel-splitter">
            -
          </span>
          <input
            type="text"
            className='question__personal-info__3input'
            name={props.question.getOutputName(FIELDS.homeTel3)}
            id={props.question.getOutputName(FIELDS.homeTel3)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.homeTel3)}
            pattern="\d+"
            maxLength="5"
            data-parsley-pattern-message="正しい電話番号を入力してください"
            data-parsley-required={props.item.isRequire()}
          />
        </span>
      );
      break;
    default:
      inputContent = (<input
        type="text"
        name={props.question.getOutputName(FIELDS.homeTel)}
        id={props.question.getOutputName(FIELDS.homeTel)}
        data-output-no={getOutputNo(props.survey, props.question, FIELDS.homeTel)}
        data-parsley-pattern="\(?\d+\)?\-?\d+\-?\d+"
        data-parsley-pattern-message="正しい電話番号を入力してください"
        data-parsley-required={props.item.isRequire()}
      />);
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        {inputContent}
      </label>
    </td>
  </tr>);
};

export const HospitalPrefectureRow = (props) => {
  let inputContent;
  switch (props.item.getDisplayTypeId()) {
    case 'none':
      return null;
    case 'select_input':
      inputContent = (<span>
        <select
          name={props.question.getOutputName(FIELDS.hospitalPrefecture)}
          id={props.question.getOutputName(FIELDS.hospitalPrefecture)}
          style={{ width: '10em' }}
          data-output-no={getOutputNo(props.survey, props.question, FIELDS.hospitalPrefecture)}
          data-parsley-required={props.item.isRequire()}
          className="question__personal-info__select_with_input"
        >
          <option value="">▽</option>
          {PREFECTURES.map(p => <option key={`${props.question.getOutputName(FIELDS.hospitalPrefecture)}_${p}`} value={p}>{p}</option>)}
        </select>
        <input
          type="text"
          name={props.question.getOutputName(FIELDS.hospitalPrefectureText)}
          id={props.question.getOutputName(FIELDS.hospitalPrefectureText)}
          data-output-no={getOutputNo(props.survey, props.question, FIELDS.hospitalPrefectureText)}
          data-parsley-required={props.item.isRequire()}
          className="question__personal-info__input_with_select"
          placeholder="市区町村"
        />
      </span>);
      break;
    case 'input':
      inputContent = (
        <input
          type="text"
          name={props.question.getOutputName(FIELDS.hospitalPrefectureText)}
          id={props.question.getOutputName(FIELDS.hospitalPrefectureText)}
          data-output-no={getOutputNo(props.survey, props.question, FIELDS.hospitalPrefectureText)}
          data-parsley-required={props.item.isRequire()}
        />
      );
      break;
    default:
      inputContent = (
        <select
          name={props.question.getOutputName(FIELDS.hospitalPrefecture)}
          id={props.question.getOutputName(FIELDS.hospitalPrefecture)}
          style={{ width: '10em' }}
          data-output-no={getOutputNo(props.survey, props.question, FIELDS.hospitalPrefecture)}
          data-parsley-required={props.item.isRequire()}
        >
          <option value="">▽</option>
          {PREFECTURES.map(p => <option key={`${props.question.getOutputName(FIELDS.hospitalPrefecture)}_${p}`} value={p}>{p}</option>)}
        </select>
      );
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      {inputContent}
    </td>
  </tr>);
};

export const InterviewPlaceRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        <input
          type="text"
          name={props.question.getOutputName(FIELDS.interviewPlace)}
          id={props.question.getOutputName(FIELDS.interviewPlace)}
          data-output-no={getOutputNo(props.survey, props.question, FIELDS.interviewPlace)}
          data-parsley-required={props.item.isRequire()}
        />
      </label>
    </td>
  </tr>);
};

export const InterviewMeansRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label className="question__personal-info__label-inline">
        <span className="question__personal-info__choice">
          <input
            type="radio"
            name={props.question.getOutputName(FIELDS.interviewMeans)}
            id={props.question.getOutputName(FIELDS.interviewMeans)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.interviewMeans)}
            data-parsley-required={props.item.isRequire()}
          />訪問
        </span>
      </label>
      <label className="question__personal-info__label-inline">
        <span className="question__personal-info__choice">
          <input
            type="radio"
            name={props.question.getOutputName(FIELDS.interviewMeans)}
            id={props.question.getOutputName(FIELDS.interviewMeans)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.interviewMeans)}
            data-parsley-required={props.item.isRequire()}
          />電話
        </span>
      </label>
      <label className="question__personal-info__label-inline">
        <span className="question__personal-info__choice">
          <input
            type="radio"
            name={props.question.getOutputName(FIELDS.interviewMeans)}
            id={props.question.getOutputName(FIELDS.interviewMeans)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.interviewMeans)}
            data-parsley-required={props.item.isRequire()}
          />どちらでも
        </span>
      </label>
    </td>
  </tr>);
};

export const InterviewRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  const interviewContactCheckboxGroup = `${props.question.getId()}_interviewContact`;
  const interviewContactContainer = `${props.question.getId()}_interviewContactContainer`;

  const mobileContent = (!props.mobileTel.isDisable() && <label className="personalInfo-label">
    <input
      name={props.question.getOutputName(FIELDS.interviewContactMobileTel)}
      id={props.question.getOutputName(FIELDS.interviewContactMobileTel)}
      type="checkbox"
      value="1"
      data-output-no={getOutputNo(props.survey, props.question, FIELDS.interviewContactMobileTel)}
      data-parsley-class-handler={`#${interviewContactContainer}`}
      data-parsley-required={props.item.isRequire()}
      data-parsley-multiple={interviewContactCheckboxGroup}
    />
    <span id={`${props.question.getOutputName(FIELDS.interviewContactMobileTel)}__text`} className={classNames('select-tool check-not-text', { disabled: !props.mobileTel.isRequire() })}>
      {props.mobileTel.getLabel()}
    </span>
  </label>);

  const homeContent = (!props.homeTel.isDisable() && <label className="personalInfo-label">
    <input
      name={props.question.getOutputName(FIELDS.interviewContactHomeTel)}
      disabled={!props.homeTel.isDisable()}
      id={props.question.getOutputName(FIELDS.interviewContactHomeTel)}
      type="checkbox"
      value="1"
      data-output-no={getOutputNo(props.survey, props.question, FIELDS.interviewContactHomeTel)}
      data-parsley-class-handler={`#${interviewContactContainer}`}
      data-parsley-required={props.item.isRequire()}
      data-parsley-multiple={interviewContactCheckboxGroup}
    />
    <span id={`${props.question.getOutputName(FIELDS.interviewContactHomeTel)}__text`} className={classNames('select-tool check-not-text', { disabled: !props.homeTel.isRequire() })}>
      {props.homeTel.getLabel()}
    </span>
  </label>);

  const workContent = (!props.workTel.isDisable() && <label className="personalInfo-label">
    <input
      name={props.question.getOutputName(FIELDS.interviewContactWorkTel)}
      id={props.question.getOutputName(FIELDS.interviewContactWorkTel)}
      type="checkbox"
      value="1"
      data-output-no={getOutputNo(props.survey, props.question, FIELDS.interviewContactWorkTel)}
      data-parsley-class-handler={`#${interviewContactContainer}`}
      data-parsley-required={props.item.isRequire()}
      data-parsley-multiple={interviewContactCheckboxGroup}
    />
    <span id={`${props.question.getOutputName(FIELDS.interviewContactWorkTel)}__text`} className={classNames('select-tool check-not-text', { disabled: !props.workTel.isRequire() })}>
      {props.workTel.getLabel()}
    </span>
  </label>);

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <div id={interviewContactContainer}>
        ご都合のよろしいご連絡先<br />
        {mobileContent}
        {homeContent}
        {workContent}
      </div>
    </td>
  </tr>);
};

export const MobileTelRow = (props) => {
  let inputContent;
  switch (props.item.getDisplayTypeId()) {
    case 'none':
      return null;
    case '3input':
      inputContent = (
        <span>
          <input
            type="text"
            name={props.question.getOutputName(FIELDS.mobileTel1)}
            id={props.question.getOutputName(FIELDS.mobileTel1)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.mobileTel1)}
            pattern="\d+"
            maxLength="5"
            data-parsley-pattern-message="正しい電話番号を入力してください"
            data-parsley-required={props.item.isRequire()}
          />
          <span className="question__personal-info__tel-splitter">
            -
          </span>
          <input
            type="text"
            name={props.question.getOutputName(FIELDS.mobileTel2)}
            id={props.question.getOutputName(FIELDS.mobileTel2)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.mobileTel2)}
            pattern="\d+"
            maxLength="5"
            data-parsley-pattern-message="正しい電話番号を入力してください"
            data-parsley-required={props.item.isRequire()}
          />
          <span className="question__personal-info__tel-splitter">
            -
          </span>
          <input
            type="text"
            name={props.question.getOutputName(FIELDS.mobileTel3)}
            id={props.question.getOutputName(FIELDS.mobileTel3)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.mobileTel3)}
            pattern="\d+"
            maxLength="5"
            data-parsley-pattern-message="正しい電話番号を入力してください"
            data-parsley-required={props.item.isRequire()}
          />
        </span>
      );
      break;
    default:
      inputContent = (<input
        type="text"
        name={props.question.getOutputName(FIELDS.mobileTel)}
        id={props.question.getOutputName(FIELDS.mobileTel)}
        data-output-no={getOutputNo(props.survey, props.question, FIELDS.mobileTel)}
        data-parsley-required={props.item.isRequire()}
        data-parsley-pattern="\(?\d+\)?\-?\d+\-?\d+"
        data-parsley-pattern-message="正しい電話番号を入力してください"
      />);
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        {inputContent}
      </label>
    </td>
  </tr>);

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>

      </label>
    </td>
  </tr>);
};

export const NameRow = (props) => {
  let inputContent;
  switch (props.item.getDisplayTypeId()) {
    case 'none':
      return null;
    case '2input':
      inputContent = (
        <span>
          <input
            type="text"
            name={props.question.getOutputName(FIELDS.firstName)}
            id={props.question.getOutputName(FIELDS.firstName)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.firstName)}
            data-parsley-required={props.item.isRequire()}
            className="question__personal-info__2input"
            placeholder="姓"
          />
          <span className="question__personal-info__name-splitter" />
          <input
            type="text"
            name={props.question.getOutputName(FIELDS.lastName)}
            id={props.question.getOutputName(FIELDS.lastName)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.lastName)}
            data-parsley-required={props.item.isRequire()}
            className="question__personal-info__2input"
            placeholder="名"
          />
        </span>
      );
      break;
    default:
      inputContent = (<input
        type="text"
        name={props.question.getOutputName(FIELDS.name)}
        id={props.question.getOutputName(FIELDS.name)}
        data-output-no={getOutputNo(props.survey, props.question, FIELDS.name)}
        data-parsley-required={props.item.isRequire()}
      />);
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        {inputContent}
      </label>
    </td>
  </tr>);
};

export const PositionRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        <input
          type="text"
          name={props.question.getOutputName(FIELDS.position)}
          id={props.question.getOutputName(FIELDS.position)}
          data-output-no={getOutputNo(props.survey, props.question, FIELDS.position)}
          data-parsley-required={props.item.isRequire()}
        />
      </label>
    </td>
  </tr>);
};

export const ProfessionalAreaRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        <input
          type="text"
          name={props.question.getOutputName(FIELDS.professionalArea)}
          id={props.question.getOutputName(FIELDS.professionalArea)}
          data-output-no={getOutputNo(props.survey, props.question, FIELDS.professionalArea)}
          data-parsley-required={props.item.isRequire()}
        />
      </label>
    </td>
  </tr>);
};

export const RequestEtcRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        <input
          type="text"
          name={props.question.getOutputName(FIELDS.requestEtc)}
          id={props.question.getOutputName(FIELDS.requestEtc)}
          data-output-no={getOutputNo(props.survey, props.question, FIELDS.requestEtc)}
          data-parsley-required={props.item.isRequire()}
        />
      </label>
    </td>
  </tr>);
};

export const ScheduleRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  const scheduleContactCheckboxGroup = `${props.question.getId()}_scheduleContact`;
  const scheduleContactContainer = `${props.question.getId()}_scheduleContactContainer`;

  const mobileContent = (!props.mobileTel.isDisable() && <label className="personalInfo-label">
    <input
      name={props.question.getOutputName(FIELDS.scheduleContactMobileTel)}
      id={props.question.getOutputName(FIELDS.scheduleContactMobileTel)}
      disabled={!props.mobileTel.isRequire()}
      type="checkbox"
      value="1"
      data-output-no={getOutputNo(props.survey, props.question, FIELDS.scheduleContactMobileTel)}
      data-parsley-class-handler={`#${scheduleContactContainer}`}
      data-parsley-required={props.item.isRequire()}
      data-parsley-multiple={scheduleContactCheckboxGroup}
    />
    <span id={`${props.question.getOutputName(FIELDS.scheduleContactMobileTel)}__text`} className={classNames('select-tool check-not-text', { disabled: !props.mobileTel.isRequire() })}>
      {props.mobileTel.getLabel()}
    </span>
  </label>);

  const homeContent = (!props.homeTel.isDisable() && <label className="personalInfo-label">
    <input
      name={props.question.getOutputName(FIELDS.scheduleContactHomeTel)}
      id={props.question.getOutputName(FIELDS.scheduleContactHomeTel)}
      disabled={!props.homeTel.isRequire()}
      type="checkbox"
      value="1"
      data-output-no={getOutputNo(props.survey, props.question, FIELDS.scheduleContactHomeTel)}
      data-parsley-class-handler={`#${scheduleContactContainer}`}
      data-parsley-required={props.item.isRequire()}
      data-parsley-multiple={scheduleContactCheckboxGroup}
    />
    <span id={`${props.question.getOutputName(FIELDS.scheduleContactHomeTel)}__text`} className={classNames('select-tool check-not-text', { disabled: !props.homeTel.isRequire() })}>
      {props.homeTel.getLabel()}
    </span>
  </label>);

  const workContent = (!props.workTel.isDisable() && <label className="personalInfo-label">
    <input
      name={props.question.getOutputName(FIELDS.scheduleContactWorkTel)}
      id={props.question.getOutputName(FIELDS.scheduleContactWorkTel)}
      disabled={!props.workTel.isRequire()}
      type="checkbox"
      value="1"
      data-output-no={getOutputNo(props.survey, props.question, FIELDS.scheduleContactWorkTel)}
      data-parsley-class-handler={`#${scheduleContactContainer}`}
      data-parsley-required={props.item.isRequire()}
      data-parsley-multiple={scheduleContactCheckboxGroup}
    />
    <span id={`${props.question.getOutputName(FIELDS.scheduleContactWorkTel)}__text`} className={classNames('select-tool check-not-text', { disabled: !props.workTel.isRequire() })}>
      {props.workTel.getLabel()}
    </span>
  </label>);

  const emailContent = (!props.email.isDisable() && <label className="personalInfo-label">
    <input
      name={props.question.getOutputName(FIELDS.scheduleContactEmail)}
      id={props.question.getOutputName(FIELDS.scheduleContactEmail)}
      disabled={!props.email.isRequire()}
      type="checkbox"
      value="1"
      data-output-no={getOutputNo(props.survey, props.question, FIELDS.scheduleContactEmail)}
      data-parsley-class-handler={`#${scheduleContactContainer}`}
      data-parsley-required
      data-parsley-multiple={scheduleContactCheckboxGroup}
    />
    <span id={`${props.question.getOutputName(FIELDS.scheduleContactEmail)}__text`} className={classNames('select-tool check-not-text', { disabled: !props.email.isRequire() })}>
      {props.email.getLabel()}
    </span>
  </label>);

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <div id={scheduleContactContainer}>
        ご都合のよろしいご連絡先<br />
        <b>※可能であればお電話でもご連絡させていただきたく、電話番号のうち、出来るだけどちらか一つはお選びください。</b>
        {mobileContent}
        {homeContent}
        {workContent}
        {emailContent}
      </div>
      <div style={{ paddingTop: '1em' }}>
        ご連絡のつきやすい時間帯（平日）<br />
        <label>
          <input
            type="text"
            name={props.question.getOutputName(FIELDS.contactTimeWeekday)}
            id={props.question.getOutputName(FIELDS.contactTimeWeekday)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.contactTimeWeekday)}
            data-parsley-required={props.item.isRequire()}
          />
        </label>
      </div>
      <div style={{ paddingTop: '1em' }}>
        ご連絡のつきやすい時間帯（休日）<br />
        <label>
          <input
            type="text"
            name={props.question.getOutputName(FIELDS.contactTimeWeekend)}
            id={props.question.getOutputName(FIELDS.contactTimeWeekend)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.contactTimeWeekend)}
            data-parsley-required={props.item.isRequire()}
          />
          <span>※任意でご記入ください。</span>
        </label>
      </div>
    </td>
  </tr>);
};

export const SexRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <select
        name={props.question.getOutputName(FIELDS.sex)}
        id={props.question.getOutputName(FIELDS.sex)}
        style={{ width: '10em' }}
        data-output-no={getOutputNo(props.survey, props.question, FIELDS.sex)}
        data-parsley-required={props.item.isRequire()}
      >
        <option value="">▽</option>
        <option value="男">男</option>
        <option value="女">女</option>
      </select>
    </td>
  </tr>);
};

export const SpecialityRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        <input
          type="text"
          name={props.question.getOutputName(FIELDS.specialty)}
          id={props.question.getOutputName(FIELDS.specialty)}
          data-output-no={getOutputNo(props.survey, props.question, FIELDS.specialty)}
          data-parsley-required={props.item.isRequire()}
        />
      </label>
    </td>
  </tr>);
};


export const WorkPostalCodeRow = (props) => {
  if (props.item.getDisplayTypeId() === 'none') {
    return null;
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        <input
          type="text"
          name={props.question.getOutputName(FIELDS.workPostalCode)}
          id={props.question.getOutputName(FIELDS.workPostalCode)}
          data-output-no={getOutputNo(props.survey, props.question, FIELDS.workPostalCode)}
          data-parsley-required={props.item.isRequire()}
        />
      </label>
    </td>
  </tr>);
};


export const WorkTelRow = (props) => {
  let inputContent;
  switch (props.item.getDisplayTypeId()) {
    case 'none':
      return null;
    case '3input':
      inputContent = (
        <span>
          <input
            type="text"
            className="question__personal-info__3input"
            name={props.question.getOutputName(FIELDS.workTel1)}
            id={props.question.getOutputName(FIELDS.workTel1)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.workTel1)}
            pattern="\d+"
            maxLength="5"
            data-parsley-pattern-message="正しい電話番号を入力してください"
            data-parsley-required={props.item.isRequire()}
          />
          <span className="question__personal-info__tel-splitter">
            -
          </span>
          <input
            type="text"
            className="question__personal-info__3input"
            name={props.question.getOutputName(FIELDS.workTel2)}
            id={props.question.getOutputName(FIELDS.workTel2)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.workTel2)}
            pattern="\d+"
            maxLength="5"
            data-parsley-pattern-message="正しい電話番号を入力してください"
          />
          <span className="question__personal-info__tel-splitter">
            -
          </span>
          <input
            type="text"
            className="question__personal-info__3input"
            name={props.question.getOutputName(FIELDS.workTel3)}
            id={props.question.getOutputName(FIELDS.workTel3)}
            data-output-no={getOutputNo(props.survey, props.question, FIELDS.workTel3)}
            pattern="\d+"
            maxLength="5"
            data-parsley-pattern-message="正しい電話番号を入力してください"
            data-parsley-required={props.item.isRequire()}
          />
        </span>
      );
      break;
    default:
      inputContent = (<input
        type="text"
        name={props.question.getOutputName(FIELDS.workTel)}
        id={props.question.getOutputName(FIELDS.workTel)}
        data-output-no={getOutputNo(props.survey, props.question, FIELDS.workTel)}
        data-parsley-required={props.item.isRequire()}
        data-parsley-pattern="\(?\d+\)?\-?\d+\-?\d+"
        data-parsley-pattern-message="正しい電話番号を入力してください"
      />);
  }

  return (<tr>
    <td>
      {props.item.getLabel()}
      {!props.item.isRequire() && optionalLabel()}
    </td>
    <td>
      <label>
        {inputContent}
      </label>
    </td>
  </tr>);
};

