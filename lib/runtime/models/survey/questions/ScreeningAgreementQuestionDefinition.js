import uuid from 'node-uuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';
import OutputDefinition from './OutputDefinition';
import ItemDefinition from './ItemDefinition';

/** 設問定義：調査許諾 */
export default class ScreeningAgreementQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    const items = List([
      'はい、協力します。',
      'はい、協力します。有害事象の報告の際には匿名を希望します。',
      'いいえ、調査には協力できません。',
    ]).map((label, index) =>
      ItemDefinition.create(index)
        .set('label', label)
        .set('plainLabel', label)
        .set('value', `value${index + 1}`),
    ).toList();
    return new ScreeningAgreementQuestionDefinition({
      _id: uuid.v4(),
      dataType: 'ScreeningAgreement',
      title: '調査許諾',
      plainTitle: '調査許諾',
      description: `
        <div class="agreement-description">
          <p>このインタビューの目的は市場調査であり、販売促進活動ではありません。</p>
          <div class="informationBox">
            ■個人情報及び匿名性の保護について <br>
            回答の機密性は市場調査のプライバシー保護原則に則って厳密に保護され、個人の身元を特定できる情報が本調査の依頼元に開示されることはありません。なお、弊社では<u>内容分析のためインタビューを録音し、本調査の依頼主に提供させて頂きます</u>。また、調査を依頼した企業の関係者が拝聴させていただく場合もございます。予めご了承下さい。お伺い致しましたご意見が内容分析以外に使用されることはなく、調査の結果によりご迷惑をおかけすることは一切ございません。<br>
            <br>
            ■有害事象について<br>
            本調査中に副作用、毒性、パッケージに関する問題点などの有害事象について言及があった場合、既に当該企業または規制当局に報告されている内容であったとしても、私どもから依頼元の医薬品医療機器安全性評価部門に全ての情報を報告する必要があります。匿名での報告も可能です。 <br>
            <br>
            ■機密情報の取り扱いについて       <br>
            この調査にご参加頂くに当たり、独占的かつ極秘とみなされる情報に触れる可能性がありますが（現段階ではまた開発中で、政府規制機関による検証または認可が行われていない実験的または仮説的概念、製品の説明またはデータ等）、 <br>
            <u>この情報は調査目的のためのみに共有されたものであり、臨床的使用のための製品販売促進の意図はございません。</u>
            <br>
            1) 上記の情報すべての機密を保持すること<br>
            2) 事前の書面による同意なしで、任意の人物や企業体に当該情報を開示しないこと<br>
            3) 事前の書面による同意なしで当該情報を使用しないこと<br>
            以上に合意頂きますようお願い致します。
          </div>
          <p>この条件に基づいて、調査にご協力いただけますか。</p>
        </div>`,
      items,
    });
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions() {
    const id = this.getId();
    const ret = List();
    return ret.push(new OutputDefinition({
      _id: id,
      name: id,
      label: `${this.getPlainTitle()}`,
      outputType: 'radio',
    }));
  }
}
