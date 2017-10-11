import $ from 'jquery';
import S from 'string';
import { createQueryForOutputDefinition, parseInteger, findElementsByOutputDefinitions, swapNodes } from '../../../utils';

/**
 * Matrixの動作を定義する
 */
export default class Matrix {
  constructor(el, survey, page, runtime) {
    this.el = el;
    this.survey = survey;
    this.page = page;
    this.runtime = runtime;
    this.observers = [];
  }

  /** Matrix設問を取得する */
  findMatrixQuestions() {
    return this.page.getQuestions().filter(question => question.getDataType() === 'Matrix');
  }

  /** Matrixの数値設問を取得する */
  findMatrixNumberQuestions() {
    return this.page.getQuestions().filter(question => question.getDataType() === 'Matrix' && question.getMatrixType() === 'number');
  }

  /** Matrixの数値設問を取得する */
  findMatrixCheckboxQuestions() {
    return this.page.getQuestions().filter(question => question.getDataType() === 'Matrix' && question.getMatrixType() === 'checkbox');
  }

  /**
   * 行の値のチェンジハンドラ
   * 合計値を計算して設定する。
   *
   * @param {List} rowOutputDefinitions 合計値を計算するために必要となる要素のOutputDefinitionのリスト
   * @param {jQuery Object} $sumElement 合計値のjQueryオブジェクト
   */
  handleChangeNumberForSum(rowOutputDefinitions, $sumElement) {
    const $rowElements = findElementsByOutputDefinitions(...rowOutputDefinitions);
    const sum = $rowElements
      .toArray()
      .filter(el => $(el).isEnabled())
      .reduce((prev, curr) => prev + parseInteger(curr.value, 0), 0);
    $sumElement.val(sum);
  }

  /**
   * Matrixの行合計機能を追加する
   *
   * @param {MatrixQuestionDefinition} question 設問のインスタンス
   */
  matrixSumForRows(question) {
    if (!question.isMatrixSumRows()) return;

    const sumOutputDefinitions = question.getOutputDefinitionForSum('rows');

    question.getItems().forEach((item, i) => {
      const outputDefinitions = question.getSubItems()
        .map(subItem => question.getOutputDefinitionFromItemAndSubItem(item, subItem));
      const query = outputDefinitions
        .map(od => createQueryForOutputDefinition(od))
        .join(',');
      const $targetElement = findElementsByOutputDefinitions(sumOutputDefinitions.get(i));
      $(this.el).on('change keyup', query, this.handleChangeNumberForSum.bind(this, outputDefinitions, $targetElement));
    });
  }

  /**
   * Matrixの列合計機能を追加する
   *
   * @param {MatrixQuestionDefinition} question 設問のインスタンス
   */
  matrixSumForColumns(question) {
    if (!question.isMatrixSumCols()) return;

    const sumOutputDefinitions = question.getOutputDefinitionForSum('columns');

    question.getSubItems().forEach((subItem, i) => {
      const outputDefinitions = question.getItems()
        .map(item => question.getOutputDefinitionFromItemAndSubItem(item, subItem));
      const query = outputDefinitions
        .map(od => createQueryForOutputDefinition(od))
        .join(',');
      const $targetElement = findElementsByOutputDefinitions(sumOutputDefinitions.get(i));
      $(this.el).on('change keyup', query, this.handleChangeNumberForSum.bind(this, outputDefinitions, $targetElement));
    });
  }

  /**
   * 排他のチェックボックスがchangeされたときのイベントハンドラ
   * sameGroupOutputDefinitionsの項目のdisableを切り替える
   *
   * @param {List} sameGroupOutputDefinitions 同じグループのOutputDefinitionのList
   * @param {OutputDefinition} sourceOutputDefinition 変更されたチェックボックスに対応するOutputDefinition
   * @param {Event} e イベントオブジェクト
   */
  handleChangeExclusiveCheckbox(sameGroupOutputDefinitions, sourceOutputDefinition, e) {
    const query = sameGroupOutputDefinitions
      .filter(od => od.getId() !== sourceOutputDefinition.getId())
      .map(od => createQueryForOutputDefinition(od))
      .join(',');
    $(query).disable(e.target.checked);
  }

  /**
   * 排他機能を追加する
   *
   * @param {MatrixQuestionDefinition} question 設問のインスタンス
   */
  matrixExclusiveCheckbox(question) {
    const $el = $(this.el);
    question.getSubItems()
      .filter(subItem => subItem.isExclusive())
      .forEach((subItem) => {
        question.getItems().forEach((item) => {
          const checkboxOutputDefinition = question.getOutputDefinitionFromItemAndSubItem(item, subItem);
          const sameGroupOutputDefinitions = question.getSameItemGroupOutputDefinition(item);
          const query = createQueryForOutputDefinition(checkboxOutputDefinition);
          $el.on('change', query, this.handleChangeExclusiveCheckbox.bind(this, sameGroupOutputDefinitions, checkboxOutputDefinition));
        });
      });
  }

  /**
   * itemに対応するtr要素を取得する
   *
   * @param {MatrixQuestionDefinition} question 設問のインスタンス
   * @param {ItemDefinition} item 対象となるItemDefinition
   */
  findTrElementFromItem(question, item) {
    return $(this.el).find(`#${item.getId()}`);
  }

  /**
   * subItemに対応するtd要素(0番目)のindexを取得する
   *
   * @param {MatrixQuestionDefinition} question 設問のインスタンス
   * @param {ItemDefinition} item 対象となるItemDefinition
   */
  findTdElementFromSubItem(question, subItem) {
    return $(this.el).find(`#${subItem.getId()}`);
  }

  /**
   * 行をランダムにする
   *
   * @param {MatrixQuestionDefinition} question 設問のインスタンス
   */
  randomizeRow(question) {
    if (!question.isRandom()) return;
    // 見えているtrのエレメントを取得
    const visibleTrElements = question
      .getItems()
      .filter(item => !item.isRandomFixed())                   // 固定は除く
      .map(item => this.findTrElementFromItem(question, item)) // 入れ替える対象のtrタグを取得
      .filter($tr => $tr.length > 0)                           // tr要素が見つからないものは除く
      .filter($tr => $tr.is(':visible'));                      // 見えていないものも除く

    // ランダムに入れ替える
    visibleTrElements
      .forEach(($tr) => {
        const $referenceElement = visibleTrElements.get(Math.floor(Math.random() * visibleTrElements.size));
        swapNodes($tr[0], $referenceElement[0]);
      });
  }

  /**
   * questionに対応する設問のtableを取得する
   *
   * @param {MatrixQuestionDefinition} question 設問のインスタンス
   */
  findTable(question) {
    return this.findTdElementFromSubItem(question, question.getSubItems().get(0)).parents('table');
  }

  /**
   * 列をランダムにする
   *
   * @param {MatrixQuestionDefinition} question 設問のインスタンス
   */
  randomizeColumns(question) {
    if (!question.isSubItemsRandom()) return;
    // random対象のcolumnのインデックスを集取
    const targetColumnIndexes = question
      .getSubItems()
      .filter(subItem => !subItem.isRandomFixed())                      // 固定は除く
      .map(subItem => this.findTdElementFromSubItem(question, subItem)) // 入れ替えるtdタグを取得する
      .filter($td => $td.is(':visible'))                                // 見えていないものも除く
      .map($td => $td.parents('tr').find('> td').index($td));           // tdタグのindexを取得

    // 対象のtableを取得
    const $table = this.findTable(question);

    const swapDistinations = targetColumnIndexes.map(() => Math.floor(Math.random() * targetColumnIndexes.size));
    // ランダムに入れ替える
    $table.find('>thead >tr, >tbody >tr').each((i, tr) => {
      targetColumnIndexes
        .forEach((columnIndex, j) => {
          const $tds = $(tr).find('>td');
          const fromNode = $tds.get(columnIndex);
          const swapDistinationIndex = swapDistinations.get(j);
          const toNode = $tds.get(targetColumnIndexes.get(swapDistinationIndex));
          swapNodes(fromNode, toNode);
        });
    });
  }

  /**
   * 一度colspan, rowspanがあるものに関しては複製する
   * <table>
   *   <tr>
   *     <td colspan="2" rowspan="2">dummy</td>
   *   </tr>
   * </table>
   * ↓
   * <table>
   *   <tr>
   *     <td data-expand-id="1">dummy</td>
   *     <td data-expand-id="1">dummy</td>
   *   </tr>
   *   <tr>
   *     <td data-expand-id="1">dummy</td>
   *     <td data-expand-id="1">dummy</td>
   *   </tr>
   * </table>
   */
  expandTable($table) {
    let expandId = 1;
    $table.find('th,td').each((i, el) => {
      const colspan = $(el).prop('colspan');
      const rowspan = $(el).prop('rowspan');
      if (colspan <= 1 && rowspan <= 1) return;
      $(el).removeAttr('colspan').removeAttr('rowspan').attr('data-expand-id', expandId++);
      const index = $(el).parents('tr').find('th,td').index(el);
      for (let j = 1; j < colspan; j++) {
        $(el).clone().insertAfter(el);
      }
      let $tr = $(el).parents('tr');
      for (let k = 1; k < rowspan; k++) {
        if ($tr.next().length === 0) {
          // trタグがなければ追加
          $('<tr/>').insertAfter($tr);
        }
        $tr = $tr.next();
        for (let l = 0; l < colspan; l++) {
          const $cells = $tr.find('th,td');
          if ($cells.length === 0) {
            $(el).clone().appendTo($tr);
          } else {
            if (index === 0) {
              $(el).clone().prependTo($tr);
            } else {
              $(el).clone().insertAfter($tr.find('th,td')[index - 1]);
            }
          }
        }
      }
    });
  }

  /**
   * 一度 expandTable で展開したtableのcolspan, rowspanを表示が崩れないように復元する。
   * その際、applyVisibilityで設定した表示・非表示を反映させる。
   */
  collapseTable($table) {
    // idの一覧を最初に取得
    const idMap = {};
    $table.find('[data-expand-id]').each((i, el) => {
      const id = $(el).attr('data-expand-id');
      idMap[id] = id;
    });
    const ids = Object.values(idMap).sort();

    // 削除するエレメントのリスト
    // すぐに消してしまうとindexがずれるために、最後にまとめて消す
    const removeElementList = [];
    ids.forEach((id) => {
      $table.find(`[data-expand-id="${id}"]`).each((i, cell) => {
        const $cell = $(cell);
        $cell.removeAttr('data-expand-id');
        if ($cell.hasClass('hidden')) return;

        // colspanを計算
        let $nextCell = $cell;
        let colspan = 1;
        while (true) {
          $nextCell = $nextCell.next();
          if ($nextCell.length === 0) break;
          if ($nextCell.attr('data-expand-id') === id) {
            if (!$nextCell.hasClass('hidden')) {
              colspan++;
              removeElementList.push($nextCell);
            }
            $nextCell.removeAttr('data-expand-id');
          } else {
            break;
          }
        }
        if (colspan > 1) $cell.attr('colspan', colspan);

        // rowspanを計算
        $nextCell = $cell;
        const xIndexOfCell = $nextCell.parents('tr').find('th,td').index($cell);
        let rowspan = 1;
        while (true) {
          $nextCell = $($nextCell.parents('tr').next().find('th,td')[xIndexOfCell]);
          if ($nextCell.length === 0) break;

          if ($nextCell.attr('data-expand-id') === id) {
            if (!$nextCell.hasClass('hidden')) {
              removeElementList.push($nextCell);
              rowspan++;
            }
            $nextCell.removeAttr('data-expand-id');
          } else {
            break;
          }
        }
        if (rowspan > 1) $cell.attr('rowspan', rowspan);
      });
    });

    removeElementList.forEach($cell => $cell.remove());
  }
  /** item・subItemの表示・非表示を切り替える */
  applyItemVisibility(question) {
    // 対象のtableを取得
    const $table = this.findTable(question);

    this.expandTable($table);

    // itemのvisibilityを適用
    question
      .getItems()
      .forEach((item) => {
        const $tr = this.findTrElementFromItem(question, item);
        if ($tr.length === 0) return; // tr要素がない場合はスキップ
        const className = item.calcVisibilityClassName(this.survey, this.runtime.getAnswers());
        $tr.addClass(className);
        // collapseTableでth,tdのvisibilityを確認するため、td,thにもclassNameの割当をしておく
        $tr.find('th,td').addClass(className);
      });

    // subItemのvisibilityを適用
    question
      .getSubItems()
      .forEach((subItem) => {
        const $td = this.findTdElementFromSubItem(question, subItem);
        if ($td.length === 0) return; // td要素がない場合はスキップ
        const targetTdIndex = $td.parents('tr').find('td').index($td);
        const className = subItem.calcVisibilityClassName(this.survey, this.runtime.getAnswers());
        $table.find('>thead >tr, >tbody >tr').each((i, tr) => {
          const $tds = $(tr).find('>td');
          $($tds[targetTdIndex]).addClass(className);
        });
      });

    this.collapseTable($table);
  }

  /** subItemsの追加入力の値によってセルをdisabledにする */
  disableCellBySubItemsAdditionalInput(question) {
    const subItemsHasAdditionalInput = question.getSubItems().filter(item => item.hasAdditionalInput());
    const items = question.getItems();
    subItemsHasAdditionalInput.forEach((subItem) => {
      const outputDefinitionForAdditionInput = question.getOutputDefinitionForAdditionalInputFromItem('column', subItem);
      const $additionalInputEl = findElementsByOutputDefinitions(outputDefinitionForAdditionInput);
      if (!S($additionalInputEl.val()).isEmpty()) return;
      items.forEach((item) => {
        const outputDefinition = question.getOutputDefinitionFromItemAndSubItem(item, subItem);
        const $targetElements = findElementsByOutputDefinitions(outputDefinition);

        if (question.getMatrixType() === 'radio') {
          // radioの場合はoutputDefinitionからだけでは要素を特定できないので別処理
          $targetElements.filter((i, el) => {
            if (question.isMatrixReverse()) {
              return el.value === question.getOutputValue(item);
            }
            return el.value === question.getOutputValue(subItem);
          }).disable(true);
        } else {
          $targetElements.disable(true);
        }
      });
    });
  }

  /** itemsの追加入力の値によってセルをdisabledにする */
  disableCellByItemsAdditionalInput(question) {
    const subItems = question.getSubItems();
    const itemHasAdditionalInputs = question.getItems().filter(item => item.hasAdditionalInput());
    itemHasAdditionalInputs.forEach((item) => {
      const outputDefinitionForAdditionInput = question.getOutputDefinitionForAdditionalInputFromItem('row', item);
      const $additionalInputEl = findElementsByOutputDefinitions(outputDefinitionForAdditionInput);
      if (!S($additionalInputEl.val()).isEmpty()) return;
      subItems.forEach((subItem) => {
        const outputDefinition = question.getOutputDefinitionFromItemAndSubItem(item, subItem);
        const $targetElements = findElementsByOutputDefinitions(outputDefinition);

        if (question.getMatrixType() === 'radio') {
          // radioの場合はoutputDefinitionからだけでは要素を特定できないので別処理
          $targetElements.filter((i, el) => {
            if (question.isMatrixReverse()) {
              return el.value === question.getOutputValue(item);
            }
            return el.value === question.getOutputValue(subItem);
          }).disable(true);
        } else {
          $targetElements.disable(true);
        }
      });
    });
  }

  /** 追加入力の値によってセルの活性非活性を一括で更新する */
  updateCellByAdditionalInput(question) {
    // 一度全ての入力を有効にする
    question.getItems().forEach((item) => {
      question.getSubItems().forEach((subItem) => {
        const outputDefinition = question.getOutputDefinitionFromItemAndSubItem(item, subItem);
        findElementsByOutputDefinitions(outputDefinition).disable(false);
      });
    });

    // 条件によって要素をdisabledにする
    this.disableCellByItemsAdditionalInput(question);    // itemの追加入力でdisabledにする
    this.disableCellBySubItemsAdditionalInput(question); // subItemの追加入力でdisabledにする
  }

  /** 追加入力の制御 */
  additionalInputControl(question) {
    // 初期化
    this.updateCellByAdditionalInput(question);

    // イベントを割り当て
    const outputDefinitionsOfAdditionalInput = question.getOutputDefinitionForAdditionalInput();
    const query = outputDefinitionsOfAdditionalInput
      .map(od => createQueryForOutputDefinition(od))
      .join(',');
    $(this.el).on('change', query, this.updateCellByAdditionalInput.bind(this, question));

    // 数値が自動的に保管されたときのことを考えて、changeイベントだけではなくMutationObserverを使用する
    outputDefinitionsOfAdditionalInput.map(od => findElementsByOutputDefinitions(od)[0]).forEach((el) => {
      const mutationObserver = new MutationObserver(this.updateCellByAdditionalInput.bind(this, question));
      mutationObserver.observe(el, { attributes: true });
      this.observers.push(mutationObserver);
    });
  }

  initialize() {
    // Matrix全て
    this.findMatrixQuestions().forEach((question) => {
      this.randomizeRow(question);                // 行のランダム化
      this.randomizeColumns(question);            // 列のランダム化
      this.applyItemVisibility(question);         // 項目の表示制御
      this.additionalInputControl(question);      // 追加入力の制御
    });
    // Matrix数値
    this.findMatrixNumberQuestions().forEach((question) => {
      this.matrixSumForRows(question);            // 行の合計値機能を追加
      this.matrixSumForColumns(question);         // 列の合計値機能を追加
    });
    // Matrixチェックボックス
    this.findMatrixCheckboxQuestions().forEach((question) => {
      this.matrixExclusiveCheckbox(question);     // 排他機能の追加
    });
  }

  deInitialize() {
    // MutationObserverの後処理
    this.observers.forEach(observer => observer.disconnect());
  }
}
