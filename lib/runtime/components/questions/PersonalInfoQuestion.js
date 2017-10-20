/* eslint-env browser */
import React, { Component } from 'react';
import QuestionDetail from '../parts/QuestionDetail';
import * as CommonQuestionParts from '../parts/CommonQuestionParts';
import * as Rows from './PersonalInfoQuestion/Rows';

/** 設問：個人情報 */
export default class PersonalInfoQuestion extends Component {
  generateRow(survey, question, item) {
    switch (item.getRowType()) {
      case 'AgeRow':
        return <Rows.AgeRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'BirthYearRow':
        return <Rows.BirthYearRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'ContactEasyTimeRow':
        return <Rows.ContactEasyTimeRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'ContactMeansRow':
        return <Rows.ContactMeansRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'EmailRow':
        return <Rows.EmailRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'FaxRow':
        return <Rows.FaxRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'FuriganaRow':
        return <Rows.FuriganaRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'HomeTelRow':
        return <Rows.HomeTelRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'HospitalNameRow':
        return <Rows.HospitalNameRow key={item.getId()} survey={survey} item={item} question={question} />;
      case 'InterviewPlaceRow':
        return <Rows.InterviewPlaceRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'InterviewMeansRow':
        return <Rows.InterviewMeansRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'InterviewRow':
        {
          const homeTel = question.getItems().filter(i => i.isHomeTelRow()).get(0);
          const mobileTel = question.getItems().filter(i => i.isMobileTelRow()).get(0);
          const workTel = question.getItems().filter(i => i.isWorkTelRow()).get(0);
          return (<Rows.InterviewRow
            key={item.getId()}
            survey={survey}
            question={question}
            item={item}
            homeTel={homeTel}
            mobileTel={mobileTel}
            workTel={workTel}
          />);
        }
      case 'MobileTelRow':
        return <Rows.MobileTelRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'HospitalPrefectureRow':
        return <Rows.HospitalPrefectureRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'NameRow':
        return <Rows.NameRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'PositionRow':
        return <Rows.PositionRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'ProfessionalAreaRow':
        return <Rows.ProfessionalAreaRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'RequestEtcRow':
        return <Rows.RequestEtcRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'ScheduleRow':
        {
          const homeTel = question.getItems().filter(i => i.isHomeTelRow()).get(0);
          const mobileTel = question.getItems().filter(i => i.isMobileTelRow()).get(0);
          const workTel = question.getItems().filter(i => i.isWorkTelRow()).get(0);
          const email = question.getItems().filter(i => i.isEmailRow()).get(0);
          return (<Rows.ScheduleRow
            key={item.getId()}
            survey={survey}
            question={question}
            item={item}
            homeTel={homeTel}
            mobileTel={mobileTel}
            workTel={workTel}
            email={email}
          />);
        }
      case 'SexRow':
        return <Rows.SexRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'SpecialityRow':
        return <Rows.SpecialityRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'WorkPostalCodeRow':
        return <Rows.WorkPostalCodeRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'WorkTelRow':
        return <Rows.WorkTelRow key={item.getId()} survey={survey} question={question} item={item} />;
      default:
        throw new Error(`NotImplementedError: ${item.getRowType()}`);
    }
  }

  render() {
    const { replacer, survey, question, options } = this.props;

    return (
      <div className="PersonalInfoQuestion">
        { CommonQuestionParts.title(question, replacer) }
        { CommonQuestionParts.description(question, replacer) }
        <div className="question">
          <table className="personalInfo question-form-grid-table">
            <tbody>
              {question.getItems().map(item => this.generateRow(survey, question, item))}
            </tbody>
          </table>
        </div>
        { options.isShowDetail() ? <QuestionDetail {...this.props} /> : null }
      </div>
    );
  }
}
