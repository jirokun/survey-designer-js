/* eslint-env browser */
import React, { Component } from 'react';
import QuestionDetail from '../parts/QuestionDetail';
import * as CommonQuestionParts from '../parts/CommonQuestionParts';
import { AgeRow, BirthYearRow, ContactEasyTimeRow, ContactMeansRow, EmailRow, FaxRow, FuriganaRow, HomeTelRow, HospitalNameRow, HospitalPrefectureRow, InterviewPlaceRow, InterviewMeansRow, InterviewRow, MobileTelRow, NameRow, PositionRow, ProfessionalAreaRow, RequestEtcRow, ScheduleRow, SexRow, SpecialityRow, WorkPostalCodeRow, WorkTelRow } from './PersonalInfoQuestion/Rows';

/** 設問：個人情報 */
export default class PersonalInfoQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homeTelEmpty: true,              // TEL（自宅）が空かどうか
      scheduleContact2Checked: false,  // _scheduleContact2はcontroled
      interviewContact2Checked: false, // _interviewContact2はcontroled
    };
  }

  generateRow(survey, question, item, homeTelEmpty) {
    switch (item.getRowType()) {
      case 'AgeRow':
        return <AgeRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'BirthYearRow':
        return <BirthYearRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'ContactEasyTimeRow':
        return <ContactEasyTimeRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'ContactMeansRow':
        return <ContactMeansRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'EmailRow':
        return <EmailRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'FaxRow':
        return <FaxRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'FuriganaRow':
        return <FuriganaRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'HomeTelRow':
        return <HomeTelRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'HospitalNameRow':
        return <HospitalNameRow key={item.getId()} survey={survey} item={item} question={question} />;
      case 'InterviewPlaceRow':
        return <InterviewPlaceRow key={item.getId()} survey={survey} question={question} item={item} homeTelEmpty={homeTelEmpty} />;
      case 'InterviewMeansRow':
        return <InterviewMeansRow key={item.getId()} survey={survey} question={question} item={item} homeTelEmpty={homeTelEmpty} />;
      case 'InterviewRow':
        const homeTelInInterview = question.getItems().filter(i => i.isHomeTelRow()).get(0);
        const mobileTelInInterview = question.getItems().filter(i => i.isMobileTelRow()).get(0);
        const workTelInInterview = question.getItems().filter(i => i.isWorkTelRow()).get(0);
        return <InterviewRow key={item.getId()} survey={survey} question={question} item={item} homeTel={homeTelInInterview} mobileTel={mobileTelInInterview} workTel={workTelInInterview} />;
      case 'MobileTelRow':
        return <MobileTelRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'HospitalPrefectureRow':
        return <HospitalPrefectureRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'NameRow':
        return <NameRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'PositionRow':
        return <PositionRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'ProfessionalAreaRow':
        return <ProfessionalAreaRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'RequestEtcRow':
        return <RequestEtcRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'ScheduleRow':
        const homeTelInSchedule = question.getItems().filter(i => i.isHomeTelRow()).get(0);
        const mobileTelInSchedule = question.getItems().filter(i => i.isMobileTelRow()).get(0);
        const workTelInSchedule = question.getItems().filter(i => i.isWorkTelRow()).get(0);
        const emailInSchedule = question.getItems().filter(i => i.isEmailRow()).get(0);
        return <ScheduleRow key={item.getId()} survey={survey} question={question} item={item} homeTel={homeTelInSchedule} mobileTel={mobileTelInSchedule} workTel={workTelInSchedule} email={emailInSchedule} />;
      case 'SexRow':
        return <SexRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'SpecialityRow':
        return <SpecialityRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'WorkPostalCodeRow':
        return <WorkPostalCodeRow key={item.getId()} survey={survey} question={question} item={item} />;
      case 'WorkTelRow':
        return <WorkTelRow key={item.getId()} survey={survey} question={question} item={item} />;
      default:
        throw new Error(`NotImplementedError: ${item.getRowType()}`);
    }
  }

  render() {
    const { replacer, survey, question, options, homeTelEmpty } = this.props;
    // TODO 廃止予定
    // const title = question.getTitle();
    // const description = question.getDescription();
    // const answers = {};

    return (
      <div className="PersonalInfoQuestion">
        { CommonQuestionParts.title(question, replacer) }
        { CommonQuestionParts.description(question, replacer) }
        <div className="question">
          <table className="personalInfo question-form-grid-table">
            <tbody>
              {question.getItems().map(item => this.generateRow(survey, question, item, homeTelEmpty))}
            </tbody>
          </table>
        </div>
        { options.isShowDetail() ? <QuestionDetail {...this.props} /> : null }
      </div>
    );
  }
}
