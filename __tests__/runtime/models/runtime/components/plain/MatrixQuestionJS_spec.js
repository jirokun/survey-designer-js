import $ from 'jquery';
import { prettyPrint } from 'html';
import MatrixQuestionJS from '../../../../../../lib/runtime/components/plain/MatrixQuestionJS';

describe('MatrixQuestionJS', () => {
  describe('expandTable', () => {
    it('trがない場合追加する', () => {
      const $table = $(`<table>
  <tr>
    <td colspan="2" rowspan="2">dummy</td>
  </tr>
</table>`);

      new MatrixQuestionJS().expandTable($table);
      const result = prettyPrint($table.prop('outerHTML'));
      expect(result).toBe(prettyPrint(`<table>
      <tbody>
          <tr>
              <td data-expand-id="1">dummy</td>
              <td data-expand-id="1">dummy</td>
          </tr>
          <tr>
              <td data-expand-id="1">dummy</td>
              <td data-expand-id="1">dummy</td>
          </tr>
      </tbody>
  </table>`));
    });
    it('trがある場合はすでにあるtrに追加される', () => {
      const $table = $(`<table>
      <tr>
        <td>hoge</td>
        <td colspan="2" rowspan="2">dummy</td>
      </tr>
      <tr>
        <td>dummy2</td>
      </tr>
    </table>`);

      new MatrixQuestionJS().expandTable($table);
      const result = prettyPrint($table.prop('outerHTML'));
      expect(result).toBe(prettyPrint(`<table>
      <tbody><tr>
        <td>hoge</td>
        <td data-expand-id="1">dummy</td><td data-expand-id="1">dummy</td>
      </tr>
      <tr>
        <td>dummy2</td><td data-expand-id="1">dummy</td><td data-expand-id="1">dummy</td>
      </tr>
    </tbody></table>`));
    });

    it('colspan3', () => {
      const $table = $(`<table>
      <tr>
        <td>hoge</td>
        <td colspan="3">dummy</td>
      </tr>
      <tr>
        <td>dummy2</td>
        <td>dummy2</td>
        <td>dummy2</td>
        <td>dummy2</td>
      </tr>
    </table>`);
      new MatrixQuestionJS().expandTable($table);
      const result = prettyPrint($table.prop('outerHTML'));
      expect(result).toBe(prettyPrint(`<table>
      <tbody><tr>
        <td>hoge</td>
        <td data-expand-id="1">dummy</td><td data-expand-id="1">dummy</td><td data-expand-id="1">dummy</td>
      </tr>
      <tr>
        <td>dummy2</td>
        <td>dummy2</td>
        <td>dummy2</td>
        <td>dummy2</td>
      </tr>
    </tbody></table>`));
    });
  });

  describe('collapseTable', () => {
    describe('colspanの復元', () => {
      it('colspan', () => {
        const $table = $(`<table>
        <tbody><tr>
          <td>hoge</td>
          <td data-expand-id="2">dummy</td><td data-expand-id="2">dummy</td><td data-expand-id="2">dummy</td>
        </tr>
        <tr>
          <td>dummy2</td>
          <td>dummy2</td>
          <td>dummy2</td>
          <td>dummy2</td>
        </tr>
      </tbody></table>`);
        new MatrixQuestionJS().collapseTable($table);
        const result = prettyPrint($table.prop('outerHTML'));
        expect(result).toBe(prettyPrint(`<table>
        <tbody><tr>
          <td>hoge</td>
          <td colspan="3">dummy</td>
        </tr>
        <tr>
          <td>dummy2</td>
          <td>dummy2</td>
          <td>dummy2</td>
          <td>dummy2</td>
        </tr>
      </tbody></table>`));
      });

      it('colspanの途中の列にhiddenクラスがある', () => {
        const $table = $(`
        <table>
        <tbody><tr>
          <td data-expand-id="1">hoge</td>
          <td data-expand-id="2">dummy</td><td data-expand-id="2" class="hidden">dummy</td><td data-expand-id="2">dummy</td>
        </tr>
        <tr>
          <td data-expand-id="3">dummy2</td>
          <td data-expand-id="4">dummy2</td>
          <td data-expand-id="5" class="hidden">dummy2</td>
          <td data-expand-id="6">dummy2</td>
        </tr>
      </tbody></table>`);
        new MatrixQuestionJS().collapseTable($table);
        const result = prettyPrint($table.prop('outerHTML'));
        expect(result).toBe(prettyPrint(`<table>
        <tbody><tr>
          <td>hoge</td>
          <td colspan="2">dummy</td><td class="hidden">dummy</td>
        </tr>
        <tr>
          <td>dummy2</td>
          <td>dummy2</td>
          <td class="hidden">dummy2</td>
          <td>dummy2</td>
        </tr>
      </tbody></table>`));
      });

      it('colspanのセルの列にhiddenクラスがある', () => {
        const $table = $(`
        <table>
        <tbody><tr>
          <td data-expand-id="1">hoge</td>
          <td data-expand-id="2" class="hidden">dummy</td><td data-expand-id="2">dummy</td><td data-expand-id="2">dummy</td>
        </tr>
        <tr>
          <td data-expand-id="3">dummy2</td>
          <td data-expand-id="4" class="hidden">dummy2</td>
          <td data-expand-id="5">dummy2</td>
          <td data-expand-id="6">dummy2</td>
        </tr>
      </tbody></table>`);
        new MatrixQuestionJS().collapseTable($table);
        const result = prettyPrint($table.prop('outerHTML'));
        expect(result).toBe(prettyPrint(`<table>
        <tbody><tr>
          <td>hoge</td>
          <td class="hidden">dummy</td><td colspan="2">dummy</td>
        </tr>
        <tr>
          <td>dummy2</td>
          <td class="hidden">dummy2</td>
          <td>dummy2</td>
          <td>dummy2</td>
        </tr>
      </tbody></table>`));
      });
    });

    describe('rowspanの復元', () => {
      it('rowspanがある', () => {
        const $table = $(`
        <tr>
          <td>1</td>
          <td rowspan="3">2</td>
        </tr>
        <tr>
          <td>3</td>
        </tr>
        <tr>
          <td>4</td>
        </tr>
        <tr>
          <td>5</td>
          <td>6</td>
        </tr>
      </table>`);
        const expectedHtml = prettyPrint($table.prop('outerHTML'));
        new MatrixQuestionJS().expandTable($table);
        new MatrixQuestionJS().collapseTable($table);
        expect(prettyPrint($table.prop('outerHTML'))).toBe(expectedHtml);
      });

      it('rowspanのcellがhidden', () => {
        const $table = $(`<table>
        <tbody><tr>
          <td class="hidden">1</td>
          <td class="hidden">2</td>
        </tr>
        <tr>
          <td>3</td><td data-expand-id="2">2</td>
        </tr>
        <tr>
          <td>4</td><td data-expand-id="2">2</td>
        </tr>
        <tr>
          <td>5</td>
          <td>6</td>
        </tr>
      </tbody></table>`);
        new MatrixQuestionJS().collapseTable($table);
        expect(prettyPrint($table.prop('outerHTML')))
          .toBe(prettyPrint(`<table>
        <tbody><tr>
          <td class="hidden">1</td>
          <td class="hidden">2</td>
        </tr>
        <tr>
          <td>3</td><td rowspan="2">2</td>
        </tr>
        <tr>
          <td>4</td>
        </tr>
        <tr>
          <td>5</td>
          <td>6</td>
        </tr>
        </tbody></table>`));
      });

      it('rowspanの途中のcellがhidden', () => {
        const $table = $(`<table>
        <tbody><tr>
          <td>1</td>
          <td data-expand-id="2">2</td>
        </tr>
        <tr class="hidden">
          <td class="hidden">3</td><td data-expand-id="2" class="hidden">2</td>
        </tr>
        <tr>
          <td>4</td><td data-expand-id="2">2</td>
        </tr>
        <tr>
          <td>5</td>
          <td>6</td>
        </tr>
      </tbody></table>`);
        new MatrixQuestionJS().collapseTable($table);
        expect(prettyPrint($table.prop('outerHTML')))
          .toBe(prettyPrint(`<table>
        <tbody><tr>
          <td>1</td>
          <td rowspan="2">2</td>
        </tr>
        <tr class="hidden">
          <td class="hidden">3</td><td class="hidden">2</td>
        </tr>
        <tr>
          <td>4</td>
        </tr>
        <tr>
          <td>5</td>
          <td>6</td>
        </tr>
      </tbody></table>`));
      });
    });
  });
});
