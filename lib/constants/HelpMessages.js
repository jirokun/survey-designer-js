export const freeMode = `
設問定義で定義したページ内容をもとに自由にレイアウトを変更できる機能です。<br />
有効にすると設問定義での変更は画面に反映されません。<br />
有効にした後に設問定義を変更する場合、HTML定義で変更に対応する必要な入力項目の追加・削除を行う必要があります
`;
export const itemVisibility = `
項目の表示・非表示を設定した条件によって切り替えます。<br />
表示を設定した場合は条件にマッチすると表示され、条件にマッチしないと非表示となります。<br />
非表示を設定した場合は条件にマッチすると非表示となり、条件にマッチしないと表示されます。<br />
`;
export const matrixHtmlEnabled = `
テーブルを自由にレイアウト変更できる機能です。<br />
有効にすると設問定義の編集内容に制限がかかり、行・列の追加・削除・移動などが行なえません。<br />
変更したい場合には一度このチェックボックスを解除して編集してください。<br />
ただし、レイアウトの編集内容は失われます。
`;
export const matrixReverse = `
通常要素をZ方向に並べますが、N方向に並べます。<br />
これによって設問タイプのラジオは縦方向の中から一つ値を選ぶように動作が変わります。<br />
その他の設問タイプではダウンロード時にデータの並び方が変わります。
`;
export const sourceEditor = `
下記のショートカットが利用できます。
<table>
  <tbody>
    <tr><th>CTRL-F</th><td>ソースコードのフォーマット</td></tr>
    <tr><th style="vertical-align: top;">CTRL-Space</th><td>ソースコードの補完<br>
      <table>
        <tr><th>先行する文字</th><td>補完される値</td></tr>
        <tr><th style="padding-right: 1em;">name:</th><td>要素の名前の補完</td></tr>
        <tr><th style="padding-right: 1em;">no:</th><td>outputNoの補完</td></tr>
        <tr><th style="padding-right: 1em;">dev:</th><td>devIdの補完</td></tr>
        <tr><th style="padding-right: 1em;">form:</th><td>要素(HTML)の補完</td></tr>
      </table>
    </td></tr>
  </tbody>
</table>
`;
export const zeroSetting = '検証エラー時に数値の未入力フィールドに0を埋める機能です';
