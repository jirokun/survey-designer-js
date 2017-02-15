/* eslint-env browser,jquery */
import Editor from 'survey-designer-js/dist/editor.bundle';

$.getJSON('sample.json').done((json) => {
  const rootElement = document.getElementById('root');
  Editor(rootElement, json);
});
