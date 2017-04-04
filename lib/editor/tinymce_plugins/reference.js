import tinymce from 'tinymce';

tinymce.PluginManager.add('reference_answer', (editor) => {
  editor.addButton('reference_answer', {
    text: '回答値参照',
    icon: false,
    onclick: () => {
      const survey = editor.settings.survey;
      const outputDefinitions = editor.settings.outputDefinitions;
      const outputDefinitionIdValues = outputDefinitions
        .map(od => ({ text: `${od.getOutputNo()} ${od.getDlLabel()}`, value: od.getId() })).toArray();
      editor.windowManager.open({
        title: 'Example',
        // bodyの作り方は次のURLを参照
        // https://makina-corpus.com/blog/metier/2016/how-to-create-a-custom-dialog-in-tinymce-4
        body: [
          { type: 'listbox', name: 'outputDefinitionId', label: '参照する設問', values: outputDefinitionIdValues },
        ],
        onsubmit: (e) => {
          editor.insertContent(`{{${e.data.outputDefinitionId}.answer}}`);
          const replacer = survey.createReplacer();
          editor.setContent(replacer.id2No(editor.getContent()));
        },
      });
    },
  });
});
